import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import EventsComponent from "../sidebar/event/events";
import MotionsComponent from "../sidebar/motion/motion";
import './style.scss';
import {setRequestedFlowPlays} from "../../store/canvasState";
import {setCurrentFlow} from "../../store/spriteState";
import LookComponent from "../Sidebar/look/looks";

export default function FlowBlocksViewComponent() {
    const spriteState = useSelector((state) => state.spritesData);
    const { currentSprite, sprites } = spriteState ?? {};
    const { currentFlow, flows } = sprites[currentSprite] ?? { flows: [] };
    const { requestedFlowPlays } = useSelector((state) => state.canvasData);
    const dispatch = useDispatch();

    useEffect(() => {
      const isFound = (requestedFlowPlays ?? []).find((e) => e.spriteName === currentSprite);
      if (isFound) {
        return;
      }
      dispatch(setRequestedFlowPlays({ spriteName: currentSprite, flowId: flows[0].id }))
    }, [flows, requestedFlowPlays])

    const playFlow = (index) => {
      dispatch(setRequestedFlowPlays({ spriteName: currentSprite, flowId: flows[index].id }))
      dispatch(setCurrentFlow({ spriteName: currentSprite, flowIndex: index }))
    }

    return (
      <div className="flow-container flex-1 h-full overflow-auto p-4 ">
        {
          flows.map((flow, flowIndex) => {
            return (
              <div
                className={(currentFlow === flowIndex ? 'active' : '') + ' flow cursor-pointer '}
                key={'flow-'+flow.id}
                onClick={() => playFlow(flowIndex)}>
                {
                  flow?.blocks?.map((block, index) => {
                    return (
                      <div key={'block-'+index} >
                        {
                          block.type === 'EVENT' &&
                          <EventsComponent
                            spriteName={currentSprite}
                            flowIndex={flowIndex}
                            blockIndex={index}
                          />
                        }
                        {
                          block.type === 'MOTION' &&
                          <MotionsComponent
                            spriteName={currentSprite}
                            flowIndex={flowIndex}
                            blockIndex={index}
                          />
                        }
                        {
                          block.type === 'LOOK' &&
                          <LookComponent
                            spriteName={currentSprite}
                            flowIndex={flowIndex}
                            blockIndex={index}
                          />
                        }
                      </div>
                    )
                  })
                }
                {
                  flow?.blocks?.length <= 0 &&
                  <div className={'empty-state'}>
                    Select the container to add blocks into it. <br/>
                    Add Event block as the topmost item.
                  </div>
                }
              </div>
            )
          })
        }
      </div>
  );
}
