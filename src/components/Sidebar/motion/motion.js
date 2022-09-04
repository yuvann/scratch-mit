import React, {useEffect, useState} from "react";
import Icon from "../../Icon";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../../store";
import {updateBlocksOfFlow} from "../../../store/spriteState";
import  './style.css';

const MotionsComponent = (props) => {
    const { spriteName: spriteNameP, flowIndex: flowIndexP, blockIndex: blockIndexP } = props;
    const isEditMode = blockIndexP >= 0;
    const spriteState = useSelector((state) => state.spritesData);
    const { currentSprite, sprites } = spriteState ?? {};
    const { currentFlow, flows } = sprites[spriteNameP ?? currentSprite] ?? {};
    const { blocks } =  flows[flowIndexP ?? currentFlow] ?? { blocks: [] };

    const [motionValues, setMotionValues] = useState( blockIndexP >= 0 ? blocks[blockIndexP] : {})

    const dispatch = useAppDispatch();

    const pushBlock = (eventName, key, defaultValue) => {
        const blocks_ = [...blocks];
        if (blockIndexP === undefined) {
            blocks_.push({ eventName, [key]: motionValues[key] || defaultValue, type: "MOTION" })
        } else {
            blocks_[blockIndexP] = { eventName, [key]: defaultValue, type: "MOTION" };
        }
        dispatch(updateBlocksOfFlow({
            spriteName: spriteNameP ?? currentSprite,
            flowIndex: flowIndexP ?? currentFlow,
            flowData: { blocks: blocks_ }
        }));
    }

    const removeBlock = (index) => {
        const blocks_ = [...blocks];
        blocks_.splice(index, 1);
        dispatch(updateBlocksOfFlow({
            spriteName: spriteNameP ?? currentSprite,
            flowIndex: flowIndexP ?? currentFlow,
            flowData: { blocks: blocks_ }
        }));
    }

    const updateMotionValues = (key, value, eventName) => {
        setMotionValues((prevState => {
            return { ...prevState, [key]: Number(value) }
        }))

        if (!isEditMode) {
            return;
        }
        pushBlock(eventName, key, Number(value));
    }

    return (
        <div className={"mb-2"} onClick={(e) => e.stopPropagation()}>
            {
                !spriteNameP && <div className="font-bold">Motions</div>
            }
            {
                (!spriteNameP || blocks[blockIndexP]?.eventName === 'MOVE_STEP') &&
                <div className="block flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 text-sm cursor-pointer">
                    Move
                    <input
                        type={'number'}
                        value={motionValues.moveStep}
                        onChange={(e) => updateMotionValues('moveStep', e.target.value, 'MOVE_STEP')}
                        className={'mx-2 motion-input'}
                    />
                    steps
                    {
                        !spriteNameP &&
                        <div onClick={() => pushBlock("MOVE_STEP", 'moveStep', 10)}>
                            <Icon name={'plus'} size={15} className="text-black mx-2"></Icon>
                        </div>
                    }
                    {
                        spriteNameP &&
                        <div onClick={() => removeBlock(blockIndexP)}>
                            <Icon name={'window-close'} size={15} className="text-black mx-2"></Icon>
                        </div>
                    }
                </div>
            }
            {
                (!spriteNameP || blocks[blockIndexP]?.eventName === 'ROTATE_RIGHT') &&
                <div className="block flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
                    Turn
                    <Icon name="undo" size={15} className="text-white mx-2" />
                    <input
                        type={'number'}
                        value={motionValues.rightRotate}
                        onChange={(e) => updateMotionValues('rightRotate', e.target.value, 'ROTATE_RIGHT')}
                        className={'mx-2 motion-input'}
                    />
                    degrees
                    {
                        !spriteNameP &&
                        <div onClick={() => pushBlock("ROTATE_RIGHT", 'rightRotate', 15)}>
                            <Icon name={'plus'} size={15} className="text-black mx-2"></Icon>
                        </div>
                    }
                    {
                        spriteNameP &&
                        <div onClick={() => removeBlock(blockIndexP)}>
                            <Icon name={'window-close'} size={15} className="text-black mx-2"></Icon>
                        </div>

                    }
                </div>
            }
            {
                (!spriteNameP || blocks[blockIndexP]?.eventName === 'ROTATE_LEFT') &&
                <div className="block flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
                    Turn
                    <Icon name="redo" size={15} className="text-white mx-2" />
                    <input
                        type={'number'}
                        value={motionValues.leftRotate}
                        onChange={(e) => updateMotionValues('leftRotate', e.target.value, 'ROTATE_LEFT')}
                        className={'mx-2 motion-input'}
                    />
                    degrees
                    {
                        !spriteNameP &&
                        <div onClick={() => pushBlock("ROTATE_LEFT", 'leftRotate', 15)}>
                            <Icon name={'plus'} size={15} className="text-black mx-2"></Icon>
                        </div>
                    }
                    {
                        spriteNameP &&
                        <div onClick={() => removeBlock(blockIndexP)}>
                            <Icon name={'window-close'} size={15} className="text-black mx-2"></Icon>
                        </div>

                    }
                </div>
            }
        </div>
    );
}

export default MotionsComponent;