'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceRadial,
  forceSimulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum
} from 'd3-force';
import Typography from '@mui/material/Typography';
import type { UserRole } from '@repo/domain/user/user-role';
import type {
  AdminStatisticsNetworkEdgeViewModel,
  AdminStatisticsNetworkNodeViewModel
} from '@repo/application/admin/models/admin-statistics';
import { userRoleVisualByRole } from '../../../admin/user-role-visual';
import UserNetworkGraphEdgeLayer from './user-network-edge-layer';
import UserNetworkGraphLegend from './user-network-legend';
import UserNetworkGraphNode from './user-network-node';
import legendStyles from './user-network-legend.module.css';
import styles from './user-network-graph.module.css';

const NODE_RADIUS_PX = 28;
const AVATAR_DIAMETER_PX = 50;
const MAX_PRODUCTION_HALO_PX = 48;
const GRAPH_PADDING_PX = NODE_RADIUS_PX + MAX_PRODUCTION_HALO_PX + 16;
const MIN_GRAPH_WIDTH_PX = 360;
const MIN_GRAPH_HEIGHT_PX = 420;
const MIN_NODE_SPACING_PX = 56;
const MAX_NODE_SPACING_PX = 112;

export type UserNetworkGraphLabels = {
  label: string;
  interactionHint: string;
  productionTitle: string;
  productionDescription: string;
  exchangeTitle: string;
  exchangeDescription: string;
  generatedAt: string;
  empty: string;
  roleByKey: Record<UserRole, string>;
};

export type UserNetworkGraphProps = {
  nodes: AdminStatisticsNetworkNodeViewModel[];
  edges: AdminStatisticsNetworkEdgeViewModel[];
  labels: UserNetworkGraphLabels;
};

type GraphNode = AdminStatisticsNetworkNodeViewModel & SimulationNodeDatum;
type GraphLink = AdminStatisticsNetworkEdgeViewModel &
  SimulationLinkDatum<GraphNode> & {
    source: string | GraphNode;
    target: string | GraphNode;
  };

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const nodeHaloRadius = (productionIndex: number): number =>
  NODE_RADIUS_PX + Math.min(MAX_PRODUCTION_HALO_PX, Math.max(0, productionIndex));

const graphChargeStrength = (nodeCount: number): number => -Math.min(420, 180 + nodeCount * 6);

const graphLinkStrength = (nodeCount: number): number => {
  if (nodeCount > 80) {
    return 0.09;
  }

  if (nodeCount > 40) {
    return 0.11;
  }

  return 0.14;
};

const graphVelocityDecay = (nodeCount: number): number => {
  if (nodeCount > 80) {
    return 0.34;
  }

  if (nodeCount > 40) {
    return 0.3;
  }

  return 0.26;
};

const graphAlphaDecay = (nodeCount: number): number => {
  if (nodeCount > 80) {
    return 0.08;
  }

  if (nodeCount > 40) {
    return 0.06;
  }

  return 0.045;
};

const initialNodePosition = (
  index: number,
  nodeCount: number,
  width: number,
  height: number
): Pick<GraphNode, 'x' | 'y'> => {
  const columns = Math.max(1, Math.ceil(Math.sqrt(nodeCount)));
  const rows = Math.max(1, Math.ceil(nodeCount / columns));
  const column = index % columns;
  const row = Math.floor(index / columns);
  const spacingX = clamp(Math.floor(width / (columns + 1)), MIN_NODE_SPACING_PX, MAX_NODE_SPACING_PX);
  const spacingY = clamp(Math.floor(height / (rows + 1)), MIN_NODE_SPACING_PX, MAX_NODE_SPACING_PX);
  const firstX = width / 2 - ((columns - 1) * spacingX) / 2;
  const firstY = height / 2 - ((rows - 1) * spacingY) / 2;

  return {
    x: firstX + column * spacingX,
    y: firstY + row * spacingY
  };
};

export default function UserNetworkGraph({ nodes, edges, labels }: UserNetworkGraphProps) {
  const instructionsId = useId();
  const graphRef = useRef<HTMLDivElement | null>(null);
  const simulationNodesRef = useRef<GraphNode[]>([]);
  const simulationLinksRef = useRef<GraphLink[]>([]);
  const [size, setSize] = useState({ width: 1000, height: 680 });
  const [, setTick] = useState(0);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [pinnedUserId, setPinnedUserId] = useState<string | null>(null);

  useEffect(() => {
    const element = graphRef.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      setSize({
        width: Math.max(MIN_GRAPH_WIDTH_PX, Math.floor(entry.contentRect.width)),
        height: Math.max(MIN_GRAPH_HEIGHT_PX, Math.floor(entry.contentRect.height))
      });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const nodeCount = nodes.length;
    const graphNodes: GraphNode[] = nodes.map((node, index) => ({
      ...node,
      ...initialNodePosition(index, nodeCount, size.width, size.height)
    }));
    const graphLinks: GraphLink[] = edges.map((edge) => ({
      ...edge,
      source: edge.sourceUserId,
      target: edge.targetUserId
    }));

    simulationNodesRef.current = graphNodes;
    simulationLinksRef.current = graphLinks;

    if (graphNodes.length === 0) {
      setTick((currentTick) => currentTick + 1);
      return;
    }

    const centerX = size.width / 2;
    const centerY = size.height / 2;
    const simulation = forceSimulation(graphNodes)
      .velocityDecay(graphVelocityDecay(nodeCount))
      .alphaDecay(graphAlphaDecay(nodeCount))
      .force('center', forceCenter(centerX, centerY))
      .force('charge', forceManyBody<GraphNode>().strength(graphChargeStrength(nodeCount)))
      .force(
        'link',
        forceLink<GraphNode, GraphLink>(graphLinks)
          .id((node) => node.userId)
          .distance((link) => 110 + Math.min(140, Math.max(0, link.exchanges * 2)))
          .strength(graphLinkStrength(nodeCount))
      )
      .force(
        'collide',
        forceCollide<GraphNode>().radius((node) => nodeHaloRadius(node.productionIndex) + 18)
      )
      .force(
        'inactiveRing',
        forceRadial<GraphNode>(
          (node) => (node.inactive ? Math.max(80, Math.min(size.width, size.height) / 2 - 80) : 0),
          centerX,
          centerY
        ).strength((node) => (node.inactive ? 0.2 : 0))
      );

    let animationFrame: number | null = null;
    simulation.on('tick', () => {
      if (animationFrame !== null) {
        return;
      }

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = null;
        setTick((currentTick) => currentTick + 1);
      });
    });

    return () => {
      simulation.stop();
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [edges, nodes, size.height, size.width]);

  const positionedNodes = simulationNodesRef.current;
  const positionedLinks = simulationLinksRef.current;

  const renderedNodes = positionedNodes.map((node) => {
    const roleLabel = labels.roleByKey[node.role];
    const roleVisual = userRoleVisualByRole[node.role];
    const diameter = nodeHaloRadius(node.productionIndex) * 2;
    const x = clamp(node.x ?? size.width / 2, GRAPH_PADDING_PX, size.width - GRAPH_PADDING_PX);
    const y = clamp(node.y ?? size.height / 2, GRAPH_PADDING_PX, size.height - GRAPH_PADDING_PX);

    return {
      ...node,
      x,
      y,
      roleLabel,
      roleVisual,
      diameter
    };
  });
  const renderedNodeById = new Map(renderedNodes.map((node) => [node.userId, node]));
  const renderedLinks = positionedLinks.map((link) => ({
    ...link,
    source: renderedNodeById.get(link.sourceUserId) ?? link.source,
    target: renderedNodeById.get(link.targetUserId) ?? link.target
  }));

  const activeUserId = pinnedUserId ?? hoveredUserId;

  const handleNodeFocus = (userId: string) => {
    setHoveredUserId(userId);
  };

  const handleNodeBlur = (userId: string) => {
    setHoveredUserId((currentHoveredUserId) => (currentHoveredUserId === userId ? null : currentHoveredUserId));
  };

  const handleNodeTogglePin = (userId: string) => {
    setPinnedUserId((currentPinnedUserId) => (currentPinnedUserId === userId ? null : userId));
  };

  return (
    <div className={styles.root}>
      <div
        className={styles.graph}
        ref={graphRef}
        role="region"
        aria-label={labels.label}
        aria-describedby={instructionsId}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setPinnedUserId(null);
            setHoveredUserId(null);
          }
        }}
        onClick={() => {
          setPinnedUserId(null);
        }}
      >
        <p id={instructionsId} className={styles.srOnly}>
          {labels.interactionHint}
        </p>
        {nodes.length === 0 ? <p className={styles.emptyState}>{labels.empty}</p> : null}
        <UserNetworkGraphEdgeLayer
          edges={renderedLinks}
          width={size.width}
          height={size.height}
          className={styles.edgeLayer}
          edgeClassName={styles.edge}
        />

        <div className={styles.nodeLayer}>
          {renderedNodes.map((node) => {
            const isActive = activeUserId === node.userId;
            const isPinned = pinnedUserId === node.userId;

            return (
              <UserNetworkGraphNode
                key={node.userId}
                node={{
                  userId: node.userId,
                  fullName: node.fullName,
                  avatarUrl: node.avatarUrl,
                  roleLabel: node.roleLabel,
                  roleVisual: node.roleVisual,
                  x: node.x,
                  y: node.y,
                  diameter: node.diameter,
                  inactive: node.inactive,
                  isActive,
                  isPinned
                }}
                avatarDiameterPx={AVATAR_DIAMETER_PX}
                handlers={{
                  onFocusNode: handleNodeFocus,
                  onBlurNode: handleNodeBlur,
                  onTogglePin: handleNodeTogglePin
                }}
              />
            );
          })}
        </div>
        <UserNetworkGraphLegend
          items={[
            {
              id: 'production',
              title: labels.productionTitle,
              description: labels.productionDescription,
              swatch: <span className={legendStyles.legendHalo} aria-hidden />
            },
            {
              id: 'exchange',
              title: labels.exchangeTitle,
              description: labels.exchangeDescription,
              swatch: <span className={legendStyles.legendEdge} aria-hidden />
            }
          ]}
        />
      </div>

      <Typography component="p" variant="caption" className={styles.generatedAt}>
        {labels.generatedAt}
      </Typography>
    </div>
  );
}
