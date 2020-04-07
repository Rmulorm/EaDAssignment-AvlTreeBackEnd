type NodeSvgShape = {
  shape?: string,
  shapeProps?: object
};

type ReactD3TreeItem = {
  name?: string,
  attributes?: {
    [key: string]: string,
  };
  children?: ReactD3TreeItem[],
  _collapsed?: boolean,
  nodeSvgShape?: NodeSvgShape
};

export { NodeSvgShape };
export default ReactD3TreeItem;
