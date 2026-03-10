'use client';

import { type JSX, type KeyboardEvent, useEffect, useRef, useState } from 'react';
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
import type { SvgIconProps } from '@mui/material/SvgIcon';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import type { UserRole } from '@repo/domain/user/user-role';
import type {
  AdminStatisticsNetworkEdgeViewModel,
  AdminStatisticsNetworkNodeViewModel
} from '@repo/view-models/admin-statistics';
import UserAvatar from '../user-avatar';
import { LogoIcon } from '../icons/logo-icon';
import { ProfileSmallIcon } from '../icons/profile-small-icon';
import styles from './admin-user-exchange-graph.module.css';

const NODE_RADIUS_PX = 28;
const AVATAR_DIAMETER_PX = 50;
const MAX_PRODUCTION_HALO_PX = 48;
const GRAPH_PADDING_PX = NODE_RADIUS_PX + MAX_PRODUCTION_HALO_PX + 16;

type AdminUserExchangeGraphProps = {
  nodes: AdminStatisticsNetworkNodeViewModel[];
  edges: AdminStatisticsNetworkEdgeViewModel[];
  labels: {
    productionTitle: string;
    productionDescription: string;
    exchangeTitle: string;
    exchangeDescription: string;
    generatedAt: string;
    empty: string;
    roleByKey: Record<UserRole, string>;
  };
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

type RoleBadgeTheme = 'ventil' | 'blue' | 'yellow' | 'red';
type RoleBadgeIcon = (props: SvgIconProps) => JSX.Element;

const roleBadgeClassKeyByTheme: Record<
  RoleBadgeTheme,
  'roleBadgeVentil' | 'roleBadgeBlue' | 'roleBadgeYellow' | 'roleBadgeRed'
> = {
  ventil: 'roleBadgeVentil',
  blue: 'roleBadgeBlue',
  yellow: 'roleBadgeYellow',
  red: 'roleBadgeRed'
};

const roleChipClassKeyByTheme: Record<
  RoleBadgeTheme,
  'roleChipVentil' | 'roleChipBlue' | 'roleChipYellow' | 'roleChipRed'
> = {
  ventil: 'roleChipVentil',
  blue: 'roleChipBlue',
  yellow: 'roleChipYellow',
  red: 'roleChipRed'
};

const roleBadgeByRole: Record<UserRole, { Icon: RoleBadgeIcon; theme: RoleBadgeTheme }> = {
  member: { Icon: LogoIcon, theme: 'ventil' },
  teacher: { Icon: ProfileSmallIcon, theme: 'blue' },
  alumni: { Icon: ProfileSmallIcon, theme: 'blue' },
  contributor: { Icon: ProfileSmallIcon, theme: 'yellow' },
  visitor: { Icon: ProfileSmallIcon, theme: 'red' }
};

export default function AdminUserExchangeGraph({ nodes, edges, labels }: AdminUserExchangeGraphProps) {
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
        width: Math.max(360, Math.floor(entry.contentRect.width)),
        height: Math.max(420, Math.floor(entry.contentRect.height))
      });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const graphNodes: GraphNode[] = nodes.map((node, index) => ({
      ...node,
      x: (index % 8) * 40 + size.width / 3,
      y: Math.floor(index / 8) * 40 + size.height / 3
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
      .force('center', forceCenter(centerX, centerY))
      .force('charge', forceManyBody<GraphNode>().strength(-220))
      .force(
        'link',
        forceLink<GraphNode, GraphLink>(graphLinks)
          .id((node) => node.userId)
          .distance((link) => 110 + Math.min(140, Math.max(0, link.exchanges * 2)))
          .strength(0.14)
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
    const radius = nodeHaloRadius(node.productionIndex);
    const diameter = radius * 2;
    const x = clamp(node.x ?? size.width / 2, GRAPH_PADDING_PX, size.width - GRAPH_PADDING_PX);
    const y = clamp(node.y ?? size.height / 2, GRAPH_PADDING_PX, size.height - GRAPH_PADDING_PX);

    return {
      ...node,
      x,
      y,
      roleLabel,
      radius,
      diameter
    };
  });

  const activeUserId = pinnedUserId ?? hoveredUserId;

  const handleNodeKeyboardToggle = (event: KeyboardEvent<HTMLDivElement>, nodeUserId: string) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    setPinnedUserId((currentPinnedUserId) => (currentPinnedUserId === nodeUserId ? null : nodeUserId));
  };

  return (
    <div className={styles.root}>
      <div
        className={styles.graph}
        ref={graphRef}
        onClick={() => {
          setPinnedUserId(null);
        }}
      >
        {nodes.length === 0 ? <p className={styles.emptyState}>{labels.empty}</p> : null}
        <svg className={styles.edgeLayer} viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden>
          <g>
            {positionedLinks.map((link) => {
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
                  className={styles.edge}
                  style={{ strokeWidth: link.widthPx }}
                />
              );
            })}
          </g>
        </svg>

        <div className={styles.nodeLayer}>
          {renderedNodes.map((node) => {
            const roleBadge = roleBadgeByRole[node.role];
            const RoleBadgeIconComponent = roleBadge.Icon;
            const themeClassName = styles[roleBadgeClassKeyByTheme[roleBadge.theme]] ?? '';
            const roleChipThemeClassName = styles[roleChipClassKeyByTheme[roleBadge.theme]] ?? '';
            const isActive = activeUserId === node.userId;
            const isPinned = pinnedUserId === node.userId;

            return (
              <div
                key={node.userId}
                className={`${styles.node}${node.inactive ? ` ${styles.inactiveNode}` : ''}${isActive ? ` ${styles.activeNode}` : ''}`}
                style={{ left: node.x, top: node.y }}
                title={`${node.fullName} — ${node.roleLabel}`}
                aria-label={`${node.fullName} (${node.roleLabel})`}
                role="button"
                tabIndex={0}
                aria-pressed={isPinned}
                onMouseEnter={() => {
                  setHoveredUserId(node.userId);
                }}
                onMouseLeave={() => {
                  setHoveredUserId((currentHoveredUserId) =>
                    currentHoveredUserId === node.userId ? null : currentHoveredUserId
                  );
                }}
                onFocus={() => {
                  setHoveredUserId(node.userId);
                }}
                onBlur={() => {
                  setHoveredUserId((currentHoveredUserId) =>
                    currentHoveredUserId === node.userId ? null : currentHoveredUserId
                  );
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  setPinnedUserId((currentPinnedUserId) => (currentPinnedUserId === node.userId ? null : node.userId));
                }}
                onKeyDown={(event) => {
                  handleNodeKeyboardToggle(event, node.userId);
                }}
              >
                <span className={styles.halo} style={{ width: node.diameter, height: node.diameter }} aria-hidden />
                <span className={styles.bubble} aria-hidden>
                  <span className={styles.avatar}>
                    <UserAvatar user={{ image: node.avatarUrl }} size={AVATAR_DIAMETER_PX} objectFit="cover" />
                  </span>
                  <span className={`${styles.roleBadge} ${themeClassName}`} aria-hidden>
                    <RoleBadgeIconComponent fontSize="inherit" />
                  </span>
                </span>
                {isActive ? (
                  <span className={styles.nodeInfo} aria-live="polite">
                    <Typography component="span" variant="subtitle2" className={styles.nodeFullName}>
                      {node.fullName}
                    </Typography>
                    <Chip
                      size="small"
                      label={node.roleLabel}
                      className={`${styles.roleChip} ${roleChipThemeClassName}`}
                    />
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>

        <aside className={styles.legend} aria-label="Legend">
          <div className={styles.legendItem}>
            <span className={styles.legendHalo} aria-hidden />
            <div className={styles.legendText}>
              <Typography component="p" variant="subtitle2" className={styles.legendTitle}>
                {labels.productionTitle}
              </Typography>
              <Typography component="p" variant="body2" className={styles.legendDescription}>
                {labels.productionDescription}
              </Typography>
            </div>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendEdge} aria-hidden />
            <div className={styles.legendText}>
              <Typography component="p" variant="subtitle2" className={styles.legendTitle}>
                {labels.exchangeTitle}
              </Typography>
              <Typography component="p" variant="body2" className={styles.legendDescription}>
                {labels.exchangeDescription}
              </Typography>
            </div>
          </div>
        </aside>
      </div>

      <Typography component="p" variant="caption" className={styles.generatedAt}>
        {labels.generatedAt}
      </Typography>
    </div>
  );
}
