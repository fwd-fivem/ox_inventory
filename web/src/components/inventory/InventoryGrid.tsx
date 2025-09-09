import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';

const PAGE_SIZE = 30;

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  return (
    <>
      <div className="inventory-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
        <div>
          <div
            className="inventory-grid-header-wrapper"
          >
            {}

            {/* Inventory Label */}
<p
  style={{
    fontFamily: 'Oswald, sans-serif',
    fontSize: '28px',
    margin: 0,
    filter:
      'drop-shadow(0 0 2px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))',
  }}
>
  {inventory.label}
</p>

            {/* Weight on the right side with no icon */}
            {inventory.maxWeight && (
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: 'Oswald, sans-serif',
                  fontSize: '21px',
                  marginLeft: 'auto',
                filter:
                  'drop-shadow(0 0 2px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))',
                }}
              >
                {/* Bag Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="25px"
                  width="25px"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ marginRight: '4px' }}
                >
                  <path
                    d="M8 12L8 8C8 5.79086 9.79086 4 12 4V4C14.2091 4 16 5.79086 16 8L16 12"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3.69435 12.6678C3.83942 10.9269 3.91196 10.0565 4.48605 9.52824C5.06013 9 5.9336 9 7.68053 9H16.3195C18.0664 9 18.9399 9 19.514 9.52824C20.088 10.0565 20.1606 10.9269 20.3057 12.6678L20.8195 18.8339C20.904 19.8474 20.9462 20.3542 20.6491 20.6771C20.352 21 19.8435 21 18.8264 21H5.1736C4.15655 21 3.64802 21 3.35092 20.6771C3.05382 20.3542 3.09605 19.8474 3.18051 18.8339L3.69435 12.6678Z"
                    fill="#fff"
                  />
                </svg>

                {/* Divider line */}
                <div
                  style={{
                    height: '1em',
                    width: '2px',
                    backgroundColor: '#fff',
                    marginRight: '6px',
                    filter:
                  'drop-shadow(0 0 2px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))',
                  }}
                />

                {/* Weight values */}
                {weight / 1000} / {inventory.maxWeight / 1000} kg
              </p>
            )}
          </div>
        </div>

        <div className="inventory-grid-container" ref={containerRef}>
          <>
            {inventory.items.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
              />
            ))}
          </>
        </div>
      </div>
    </>
  );
};

export default InventoryGrid;
