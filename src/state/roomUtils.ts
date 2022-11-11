import { FeatureShape } from "./Feature";
import { GameState } from "./GameState";
import { isOccupiedAt } from "./gridUtils";
import { ROOMS, RoomType } from "./Room";

export function getBuildableRoomTypesAt(
  { grid }: GameState,
  x: number,
  y: number
) {
  const result: { roomType: RoomType; possibleShapes: FeatureShape[] }[] = [];

  const spotIsOccupied = isOccupiedAt(grid, x, y);
  if (spotIsOccupied) {
    return result;
  }

  for (const rt in ROOMS) {
    const roomType = rt as RoomType;
    const possibleShapes = getPossibleShapesFor(roomType as RoomType);
    const possibleShapesAtLocation = possibleShapes.filter((shape) =>
      shape.every(([dx, dy]) => !isOccupiedAt(grid, x + dx, y + dy))
    );

    result.push({ roomType, possibleShapes: possibleShapesAtLocation });
  }

  return result;
}

function getPossibleShapesFor(roomType: RoomType): FeatureShape[] {
  const specs = ROOMS[roomType];
  const steps = specs.gridSpaces;
  if (steps === 1) return [[[0, 0]]];
  throw new Error("not implemented");
}
