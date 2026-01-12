import { useState } from "react";

const GRID_SIZE = 6;

const createGrid = () =>
  Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => 0)
  );

export default function App() {
  const [grid, setGrid] = useState(createGrid);
  const [path, setPath] = useState([]);

  const start = [0, 0];
  const end = [GRID_SIZE - 1, GRID_SIZE - 1];

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
          nr < GRID_SIZE &&
          nc < GRID_SIZE &&
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

  return (
    <div className="container">
      <h1>🐶 Corgi Path Finder</h1>
      <p>Click tiles to place obstacles, then find a path!</p>

      <div className="grid">
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
                onClick={() => toggleCell(r, c)}
              >
                {isStart && "🐶"}
                {isEnd && "🦴"}
              </div>
            );
          })
        )}
      </div>

      <button onClick={findPath}>Find Path</button>
    </div>
  );
}
