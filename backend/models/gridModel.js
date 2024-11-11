import mongoose from "mongoose";

const gridSchema = mongoose.Schema(
  {
    grid: {
      type: [
        [
          {
            value: { type: String, default: null },
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              default: null,
            },
          },
        ],
      ],
      default: () =>
        Array(10)
          .fill()
          .map(() => Array(10).fill({ value: null, userId: null })),
    },
  },
  {
    timestamps: true,
  }
);

const Grid = mongoose.model("Grid", gridSchema);
export default Grid;
