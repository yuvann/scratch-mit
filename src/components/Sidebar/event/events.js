import React, {useState} from "react";
import Icon from "../../Icon";
import {useSelector} from "react-redux";
import {KEYBOARD_KEYS} from "./eventsData";
import {useAppDispatch} from "../../../store";
import {updateBlocksOfFlow} from "../../../store/spriteState";

const EventsComponent = (props) => {
    const { spriteName: spriteNameP, flowIndex: flowIndexP, blockIndex: blockIndexP } = props;
    const isEditMode = blockIndexP >= 0;
    const spriteState = useSelector((state) => state.spritesData);
    const { currentSprite, sprites } = spriteState ?? {};
    const { currentFlow, flows } = sprites[spriteNameP ?? currentSprite] ?? {};
    const { blocks } =  flows[flowIndexP ?? currentFlow] ?? { blocks: [] };

    const KeyBoardKeys = Object.keys(KEYBOARD_KEYS);
    const  [selectedKeyboardEventKey, setSelectedKeyboardEventKey] = useState();

    const dispatch = useAppDispatch();

    const pushBlock = (eventName, value) => {
        const blocks_ = [...blocks];
        if (blockIndexP === undefined) {
            blocks_.push({ eventName, value, type: "EVENT" })
        } else {
            blocks_[blockIndexP] = { eventName, value, type: "EVENT" }
        }
        dispatch(updateBlocksOfFlow({
            spriteName: spriteNameP || currentSprite,
            flowIndex: flowIndexP || currentFlow,
            flowData: { blocks: blocks_ }
        }));
    }

    const onSelectKeyChange = (event) => {
        setSelectedKeyboardEventKey(Number(event.target.value));
        if (isEditMode) {
            pushBlock("KEY_PRESS", Number(event.target.value));
        }
    }

    const pushKeyboardEventBlock = () => {
        pushBlock("KEY_PRESS", selectedKeyboardEventKey || KEYBOARD_KEYS["Left Arrow"]);
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

    return (
        <div className="mb-2">
            {
                !spriteNameP && <div className="font-bold">Events</div>
            }
            {
                (!spriteNameP || blocks[blockIndexP]?.eventName === 'FLAG_CLICK') &&
                <div className=" block  flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
                    When <Icon name="flag" size={15} className="text-green-600 mx-2" /> clicked
                    {
                        !spriteNameP &&
                        <div onClick={() => pushBlock("FLAG_CLICK")}>
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
                (!spriteNameP || blocks[blockIndexP]?.eventName === 'SPRITE_CLICK') &&
                <div className="block flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
                    When this sprite clicked
                    {
                        !spriteNameP &&
                        <div onClick={() => pushBlock("SPRITE_CLICK")}>
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
                (!spriteNameP || blocks[blockIndexP]?.eventName === 'KEY_PRESS') &&
                <div className=" block  flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
                    When
                    <select
                        value={ selectedKeyboardEventKey || blocks[blockIndexP]?.value}
                        className={'text-black text-xs mx-2'}
                        onChange={(e) => onSelectKeyChange(e) }>
                        {
                            KeyBoardKeys.map((key) => {
                                return (
                                    <option key={key} value={KEYBOARD_KEYS[key]}>
                                        {key}
                                    </option>
                                )
                            })
                        }
                    </select>
                    key pressed
                    {
                        !spriteNameP &&
                        <div onClick={() => pushKeyboardEventBlock("KEY_PRESS")}>
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

export default EventsComponent;