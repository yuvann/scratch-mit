import React, {useState} from "react";
import Icon from "../../Icon";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../../store";
import {updateBlocksOfFlow} from "../../../store/spriteState";
import './style.css';

const LookComponent = (props) => {
    const { spriteName: spriteNameP, flowIndex: flowIndexP, blockIndex: blockIndexP } = props;
    const isEditMode = blockIndexP >= 0;
    const spriteState = useSelector((state) => state.spritesData);
    const { currentSprite, sprites } = spriteState ?? {};
    const { currentFlow, flows } = sprites[spriteNameP ?? currentSprite] ?? {};
    const { blocks } =  flows[flowIndexP ?? currentFlow] ?? { blocks: [] };

    const [lookValues, setLookValues] = useState( blockIndexP >= 0 ? blocks[blockIndexP] : {})

    const dispatch = useAppDispatch();

    const pushBlock = (eventName, keys, defaultValues) => {
        const blocks_ = [...blocks];
        const data = {};
        (keys ?? []).map((key, index) => {
            data[key] = lookValues[key] ?? defaultValues[index];
        })
        if (blockIndexP === undefined) {
            blocks_.push({ eventName, ...data, type: "LOOK" })
        } else {
            blocks_[blockIndexP] = { ...blocks_[blockIndexP], eventName, [keys[0]]: defaultValues[0], type: "LOOK", };
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

    const updateLookValues = (key, value, eventName) => {
        setLookValues((prevState => {
            return { ...prevState, [key]: value }
        }))
        if (!isEditMode) {
            return;
        }
        pushBlock(eventName, [key], [value]);
    }


    return (
      <div className="mb-2">
          {
            !spriteNameP && <div className="font-bold">Looks</div>
          }
          {
            (!spriteNameP || blocks[blockIndexP]?.eventName === 'SAY_TEXT') &&
            <div className="block flex flex-row flex-wrap bg-purple-400 text-white px-2 py-1 my-2 text-sm cursor-pointer">
                Say
                <input
                  type={'text'}
                  value={lookValues.sayText}
                  onChange={(e) => updateLookValues('sayText', e.target.value, 'SAY_TEXT')}
                  className={'mx-2'}
                />
                for
                <input
                  type={'number'}
                  value={lookValues.sayTextDuration}
                  onChange={(e) => updateLookValues('sayTextDuration', Number(e.target.value), 'SAY_TEXT')}
                  className={'mx-2'}
                />
                secs
                {
                  !spriteNameP &&
                  <div onClick={() => pushBlock("SAY_TEXT", ['sayText', 'sayTextDuration'], ['Hello', '2'])}>
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
            (!spriteNameP || blocks[blockIndexP]?.eventName === 'NEXT_COSTUME') &&
            <div className="block flex flex-row flex-wrap bg-purple-400 text-white px-2 py-1 my-2 text-sm cursor-pointer">
                Next costume
                {
                  !spriteNameP &&
                  <div onClick={() => pushBlock("NEXT_COSTUME")}>
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
            (!spriteNameP || blocks[blockIndexP]?.eventName === 'CHANGE_SIZE') &&
            <div className="block flex flex-row flex-wrap bg-purple-400 text-white px-2 py-1 my-2 text-sm cursor-pointer">
                Change size by
                <input
                  type={'number'}
                  value={lookValues.increaseSize}
                  onChange={(e) => updateLookValues('increaseSize', Number(e.target.value), 'CHANGE_SIZE')}
                  className={'mx-2'}
                />
                {
                  !spriteNameP &&
                  <div onClick={() => pushBlock("CHANGE_SIZE", ['increaseSize'], [10])}>
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

export default LookComponent;