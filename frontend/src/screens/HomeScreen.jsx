import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  useFetchGridQuery,
  useUpdateGridCellMutation,
} from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Row, Col } from "react-bootstrap";

const socket = io("https://gamitar.onrender.com");

const HomeScreen = () => {
  const { data: gridData, isLoading, isError } = useFetchGridQuery();
  const [updateGridCell] = useUpdateGridCellMutation();
  const [grid, setGrid] = useState(Array(10).fill(Array(10).fill(null)));
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    if (gridData) {
      setGrid(gridData.grid);
    }
  }, [gridData]);

  useEffect(() => {
    socket.on("gridUpdated", ({ rowIndex, colIndex, unicodeChar }) => {
      const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
      newGrid[rowIndex][colIndex] = { value: unicodeChar, userId: null };
      setGrid(newGrid);
    });

    socket.on("userCountUpdated", (count) => {
      setOnlineUsers(count);
    });

    return () => {
      socket.off("gridUpdated");
      socket.off("userCountUpdated");
    };
  }, [grid]);

  const handleCellClick = async (rowIndex, colIndex) => {
    const char = prompt("Enter a Unicode character (any symbol or letter)");

    if (char && char.length === 1) {
      try {
        const response = await updateGridCell({
          rowIndex,
          colIndex,
          unicodeChar: char,
        });

        if (response.error) {
          if (response.error.status === 403) {
            toast.error(
              "You have already updated a cell and cannot update another."
            );
          } else if (response.error.status === 400) {
            toast.error("This cell has already been updated by another user.");
          } else {
            toast.error("Error updating the cell.");
          }
        } else {
          const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
          newGrid[rowIndex][colIndex] = { value: char, userId: null };
          setGrid(newGrid);

          socket.emit("gridUpdate", { rowIndex, colIndex, unicodeChar: char });
        }
      } catch (error) {
        toast.error("Unexpected error occurred while updating cell.");
      }
    } else {
      alert("Please enter a valid single Unicode character.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading grid</p>;

  return (
    <Row className="justify-content-center mt-4">
      <Col md={6}>
        <h2 className="text-center">Unicode Character Grid</h2>

        <div className="grid">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="grid-cell"
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell && cell.value ? cell.value : null}
              </div>
            ))
          )}
        </div>
      </Col>
      <Col md={4} className="my-5">
        <div className="users-online">
          <h4>Users Online: {onlineUsers}</h4>
        </div>
      </Col>
    </Row>
  );
};

export default HomeScreen;
