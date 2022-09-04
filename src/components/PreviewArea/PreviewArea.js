import React, {useMemo, useEffect, useRef, useState, useCallback} from "react";
import './style.css';
import {useDispatch, useSelector} from "react-redux";
import {setSpriteConfig, updateRequestedFlowPlays} from "../../store/canvasState";
import {setCurrentSprite} from "../../store/spriteState";
import Icon from "../Icon";

const PreviewAreaComponent = () => {

  const canvas = useRef();
  const [canvasCtx, setCanvasCtx] = useState(null);
  const [canvasCords, setCanvasCords] = useState({})
  const CANVAS_WIDTH = 500;
  const CANVAS_HEIGHT = 500;

  const canvasData = useSelector((state) => state.canvasData);
  const { spriteCords } = canvasData;

  const { sprites: featureSprites, } = useSelector((state) => state.featureData);

  const { currentSprite, sprites } = useSelector((state) => state.spritesData);

  const [flowsRunning, setFlowsRunning] = useState({});
  const [eventStack, setEventStack] = useState({});
  const requestedFlowPlays = useRef([]);
  const dispatch = useDispatch();

  useEffect(() => {
    requestedFlowPlays.current = [...canvasData.requestedFlowPlays]
  }, [canvasData.requestedFlowPlays])

  useEffect(() => {
    Object.values(flowsRunning).forEach((flowRun) => {
      handleFlow(flowRun)
    })
  }, [flowsRunning])


  const handleFlow = (flowRun) => {
    const { flow, currentBlock, playId }  = flowRun;
    const block = flow.blocks[currentBlock];
    if (!block) {
      return;
    }
    if (block.type === 'MOTION') {
      handleMotion(flowRun)
    } else if (block.type === 'LOOK') {
      handleLook(flowRun);
    }
    if (currentBlock === flow.blocks.length - 1) {
      const index = requestedFlowPlays.current.findIndex((e) => e.flowId === flow.id);
      dispatch(updateRequestedFlowPlays({ index, data: { running: false }}));
      setFlowsRunning((prevState) => {
        delete prevState[playId];
        return { ...prevState };
      })
    }
  }

  useEffect(() => {
    if (!canvasCtx) {
      return;
    }
    const sprites = Object.keys(spriteCords);
    clearCanvas();
    sprites.forEach((name) => {
      drawImage(spriteCords[name], name);
    })
  }, [spriteCords, canvasCtx, currentSprite])

  const clearCanvas = () => {
    if (!canvasCtx) {
      return;
    }
    canvasCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  const isWithinCanvas = (x, y, width, height) => {
    if ((x + width <= (CANVAS_WIDTH/2) && x >= -(CANVAS_WIDTH/2))) {
      return true;
    }
    return false;
  }

  const setBasicConfig = (image, name) => {
    dispatch(setSpriteConfig(
      {
        spriteName: name,
        data: {
          currentCostume: 0,
          x: name === 'CAT' ? -(image.width/4) : 0, y: -(image.height/4), width: image.width/2, height: image.height/2,
        }
      }
    ));
  }

  const drawImage = (spriteInfo, name) => {
    if (!canvasCtx || !spriteInfo) {
      return;
    }
    const { rotate, x, y, width, height, currentCostume, text } = spriteInfo
    const image = new Image();
    image.onload = () => {
      if (!width) {
        setBasicConfig(image, name)
        return;
      }
      canvasCtx.save();
      canvasCtx.translate(CANVAS_WIDTH/2,CANVAS_HEIGHT/2);
      if (rotate) {
        canvasCtx.rotate(Number(rotate) * (Math.PI/180));
      }
      if (text) {
        drawText(text, x + width, y);
      }
      canvasCtx.drawImage(image,
        0, 0, image.width, image.height,
        x, y, width, height);
      canvasCtx.restore();
      const cb = eventStack[currentSprite]?.shift();
      setEventStack(eventStack);
      if (cb) {
        cb();
      }
    }
    image.src = featureSprites[name].costumes[currentCostume ?? 0];
  }

  const drawText = (text, x, y) => {
    if (!canvasCtx) {
      return;
    }
    canvasCtx.font = "20px Comic Sans MS";
    canvasCtx.fillStyle = "#000";
    canvasCtx.fillText(text, x, y - 15);
  }

  const handleMotion = useCallback((flowRun) => {
    if (!canvasCtx || !spriteCords) {
      return;
    }
    const { flow, currentBlock, playId }  = flowRun;
    const block = flow.blocks[currentBlock];
    let rotate = (spriteCords[currentSprite]?.rotate ?? 0);
    let { x, y, width, height } = spriteCords[currentSprite];
    if (block.eventName === 'ROTATE_RIGHT') {
      rotate += Number(block.rightRotate);
    } else if (block.eventName === 'ROTATE_LEFT') {
      rotate -= Number(block.leftRotate);
    } else if (block.eventName === 'MOVE_STEP') {
      let stepsToAdd = Number(block.moveStep);
      const isWithinCanvas_ = isWithinCanvas(x + stepsToAdd, y, width, height);
      if (!isWithinCanvas_) {
        stepsToAdd = stepsToAdd > 0 ? (CANVAS_WIDTH/2) - (x+width) : -(x + (CANVAS_WIDTH/2));
      }
      x += stepsToAdd;
    }
    dispatch(setSpriteConfig(
      {
        spriteName: currentSprite,
        data: { rotate, x }
      }
    ));
    eventStack[currentSprite] ??= [];
    eventStack[currentSprite].push(() => nextBlockInitFunc(playId));
    setEventStack(eventStack);
  }, [canvasCtx, spriteCords, eventStack, currentSprite])

  const nextBlockInitFunc = useCallback((playId) => {
    setFlowsRunning((prevState_ => {
      const prevState = { ...prevState_ };
      if (!prevState[playId]) {
        return { ...prevState };
      }
      prevState[playId].currentBlock = prevState[playId].currentBlock + 1;
      return { ...prevState };
    }))
  }, [flowsRunning]);

  const handleLook = useCallback((flowRun) => {
    if (!canvasCtx || !spriteCords) {
      return;
    }
    const { flow, currentBlock, playId }  = flowRun;
    const block = flow.blocks[currentBlock];
    let { currentCostume, width, height, text, } = spriteCords[currentSprite];
    let sayTextDuration;
    if (block.eventName === 'NEXT_COSTUME') {
      currentCostume = (currentCostume + 1) % (featureSprites[currentSprite].costumes?.length);
      text = undefined;
    } else if (block.eventName === 'CHANGE_SIZE') {
      width += block.increaseSize;
      height += block.increaseSize;
      text = undefined;
    } else if (block.eventName === 'SAY_TEXT') {
      text = block.sayText;
      sayTextDuration = block.sayTextDuration;
    }
    dispatch(setSpriteConfig(
      {
        spriteName: currentSprite,
        data: { currentCostume, width, height, text }
      }
    ));
    let callback = () => nextBlockInitFunc(playId);
    if (sayTextDuration) {
      callback = () => {
        setTimeout(() => {
          nextBlockInitFunc(playId);
          dispatch(setSpriteConfig({ spriteName: currentSprite, data: { text: null } } ));
        }, sayTextDuration * 1000);
      };
    }
    eventStack[currentSprite] ??= [];
    eventStack[currentSprite].push(callback);
    setEventStack(eventStack);
  }, [canvasCtx, spriteCords, eventStack, flowsRunning, currentSprite])


  useEffect(() => {
    const flagTrigger = document.getElementById('flag-trigger');
    flagTrigger.addEventListener('click', flagListener)
    window.addEventListener('keydown', keyboardListener)
    return () => {
      flagTrigger.removeEventListener('click', flagListener)
      window.removeEventListener('keydown', keyboardListener)
    }
  }, [sprites, currentSprite])


  const flagListener = () => {
    eventTrigger('FLAG_CLICK');
  }

  const keyboardListener = (e) => {
    let isThrottling = false;
    if (isThrottling) {
      return;
    }
    isThrottling = true;
    eventTrigger('KEY_PRESS', e.which);
    setTimeout(() => { isThrottling = false }, 200)
  }

  const validateTrigger = (block, eventName, key) => {
    if (!block) {
      return;
    }
    switch (block.eventName) {
      case 'FLAG_CLICK' : {
        return eventName === 'FLAG_CLICK';
        break;
      }
      case 'SPRITE_CLICK' : {
        return eventName === 'SPRITE_CLICK';
        break;
      }
      case 'KEY_PRESS': {
        return eventName === 'KEY_PRESS' && block.value === key;
        break;
      }
    }
    return false;
  }

  const eventTrigger = (eventName, key) => {
    requestedFlowPlays.current.forEach((e, index) => {
      if (e.running || e.spriteName !== currentSprite) {
        return;
      }
      const flow = sprites[e.spriteName].flows.find(flow => flow.id === e.flowId);
      const isValidTrigger = validateTrigger(flow.blocks[0], eventName, key);
      if (!isValidTrigger || flow.blocks.length <= 1) {
        return;
      }
      setFlowsRunning((prevState) => {
        prevState[e.flowId] = { playId: e.flowId, flow, currentBlock: 1, spriteName: e.spriteName };
        return { ...prevState };
      });
      dispatch(updateRequestedFlowPlays({ index, data: { running: true } }));
    })
  }

  useEffect(() => {
    if (!canvas.current) {
      return;
    }
    setCanvasCords(canvas.current.getBoundingClientRect().toJSON());
    setCanvasCtx(canvas.current?.getContext('2d'));
    canvas.current.width = CANVAS_WIDTH;
    canvas.current.height = CANVAS_HEIGHT;
  }, [canvas.current]);


  const onCanvasClick = (e) => {
    const scale = CANVAS_WIDTH / canvasCords.width;
    const pX = (e.clientX - canvasCords.x) * scale;
    const pY = (e.clientY - canvasCords.y) * scale;
    Object.values(spriteCords).forEach((spriteCord) => {
      let sX = CANVAS_WIDTH/2;
      let sY = CANVAS_HEIGHT/2;
      sX += spriteCord.x;
      sY += spriteCord.y;
      const sSize = (spriteCord.width);
      if ((pX >= sX && pX <= (sX + sSize)) && (pY >= sY && pY <= sY + sSize)) {
        eventTrigger('SPRITE_CLICK');
      }
    })
  }

  return (
    <div className="h-full overflow-y-auto w-full relative">
      <div className="action-bar">
        <div id={'flag-trigger'}>
          <Icon name="flag" size={25} className="text-green-600 mx-2" />
        </div>
      </div>
      <canvas ref={canvas} onClick={(e) => onCanvasClick(e)}/>
      <div className={'sprite-container'}>
        {
          Object.keys(featureSprites).map((key) => {
            return (
              <div
                className={'each-sprite' + (currentSprite === key ? ' active' : '')}
                key={key}
                onClick={() => dispatch(setCurrentSprite(key))}>
                <img src={featureSprites[key].costumes[0]}/>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default PreviewAreaComponent;