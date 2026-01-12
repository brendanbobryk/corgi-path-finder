import { useState, useEffect } from "react";

const MIN_SIZE = 4;
const MAX_SIZE = 10;

const createGrid = (size) =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 0)
  );

export default function App() {
  const [gridSize, setGridSize] = useState(6);
  const [grid, setGrid] = useState(() => createGrid(6));
  const [path, setPath] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [didDrag, setDidDrag] = useState(false);

  const start = [0, 0];
  const end = [gridSize - 1, gridSize - 1];

  useEffect(() => {
    const stopDrag = () => {
      setIsDragging(false);
    };
    window.addEventListener("mouseup", stopDrag);
    return () => window.removeEventListener("mouseup", stopDrag);
  }, []);

  const toggleCell = (r, c) => {
    if (
      (r === start[0] && c === start[1]) ||
      (r === end[0] && c === end[1])
    )
      return;

    setGrid((prev) =>
      prev.map((row, i) =>
        row.map((cell, j) =>
          i === r && j === c ? (cell === 0 ? 1 : 0) : cell
        )
      )
    );
  };

  const paintObstacle = (r, c) => {
    if (
      (r === start[0] && c === start[1]) ||
      (r === end[0] && c === end[1])
    )
      return;

    setGrid((prev) =>
      prev.map((row, i) =>
        row.map((cell, j) =>
          i === r && j === c ? 1 : cell
        )
      )
    );
  };

  const findPath = () => {
    const queue = [[start]];
    const visited = new Set([start.toString()]);

    while (queue.length) {
      const currentPath = queue.shift();
      const [r, c] = currentPath[currentPath.length - 1];

      if (r === end[0] && c === end[1]) {
        setPath(currentPath);
        return;
      }

      [
        [r + 1, c],
        [r - 1, c],
        [r, c + 1],
        [r, c - 1],
      ].forEach(([nr, nc]) => {
        if (
          nr >= 0 &&
          nc >= 0 &&
          nr < gridSize &&
          nc < gridSize &&
          grid[nr][nc] === 0 &&
          !visited.has([nr, nc].toString())
        ) {
          visited.add([nr, nc].toString());
          queue.push([...currentPath, [nr, nc]]);
        }
      });
    }

    setPath([]);
    alert("No path found!");
  };

  const resetPath = () => setPath([]);

  const resetObstacles = () => {
    setGrid(createGrid(gridSize));
    setPath([]);
  };

  const handleSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setGridSize(newSize);
    setGrid(createGrid(newSize));
    setPath([]);
  };

  return (
    <div className="container">
      <h1>🐶 Corgi Path Finder</h1>
      <p>Click to toggle • Click & drag to paint</p>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Grid Size:{" "}
          <select value={gridSize} onChange={handleSizeChange}>
            {Array.from(
              { length: MAX_SIZE - MIN_SIZE + 1 },
              (_, i) => MIN_SIZE + i
            ).map((size) => (
              <option key={size} value={size}>
                {size} x {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 50px)`,
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const isStart = r === start[0] && c === start[1];
            const isEnd = r === end[0] && c === end[1];
            const isPath = path.some(
              ([pr, pc]) => pr === r && pc === c
            );

            return (
              <div
                key={`${r}-${c}`}
                className={`cell 
                  ${cell ? "blocked" : ""}
                  ${isPath ? "path" : ""}
                  ${isStart ? "start" : ""}
                  ${isEnd ? "end" : ""}`}
                onMouseDown={() => {
                  setIsDragging(true);
                  setDidDrag(false);
                }}
                onMouseEnter={() => {
                  if (isDragging) {
                    setDidDrag(true);
                    paintObstacle(r, c);
                  }
                }}
                onClick={() => {
                  if (!didDrag) toggleCell(r, c);
                }}
              >
                {isStart && "🐶"}
                {isEnd && "🦴"}
              </div>
            );
          })
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        <button onClick={findPath}>Find Path</button>
        <button onClick={resetPath}>Reset Path</button>
        <button onClick={resetObstacles}>Reset Obstacles</button>
      </div>
    </div>
  );
}
