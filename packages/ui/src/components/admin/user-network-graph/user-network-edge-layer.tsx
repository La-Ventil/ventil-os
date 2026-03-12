type UserNetworkEdgeEndpoint = {
  x?: number;
  y?: number;
};

type UserNetworkGraphEdge = {
  source: string | UserNetworkEdgeEndpoint;
  target: string | UserNetworkEdgeEndpoint;
  sourceUserId: string;
  targetUserId: string;
  widthPx: number;
};

type UserNetworkGraphEdgeLayerProps = {
  edges: UserNetworkGraphEdge[];
  width: number;
  height: number;
  className?: string;
  edgeClassName?: string;
};

export default function UserNetworkGraphEdgeLayer({
  edges,
  width,
  height,
  className,
  edgeClassName
}: UserNetworkGraphEdgeLayerProps) {
  return (
    <svg className={className} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <g>
        {edges.map((link) => {
          const source = typeof link.source === 'string' ? null : link.source;
          const target = typeof link.target === 'string' ? null : link.target;
          if (!source || !target) {
            return null;
          }

          return (
            <line
              key={`${link.sourceUserId}:${link.targetUserId}`}
              x1={source.x ?? 0}
              y1={source.y ?? 0}
              x2={target.x ?? 0}
              y2={target.y ?? 0}
              className={edgeClassName}
              style={{ strokeWidth: link.widthPx }}
            />
          );
        })}
      </g>
    </svg>
  );
}
