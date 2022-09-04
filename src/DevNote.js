import React from "react";
import './style.css';

export default function DevNoteComponent() {
  return (
    <div className="bg-blue-100 font-sans">
      <div className={'dev-note'}>
        Hi, Kindly read the following<br/><br/>
        1. I have prioritized to build the Features than the UX (drag & drop).<br/>
        2. Instead add/remove buttons are given. It can be replaced with drag/drop easily if time given.<br/>
        3. Redux  & Code base is set in a dynamic way to support drag/drop & Multi Sprite<br/>
        4. Move N Steps Boundary breach on X axis Case is handled.<br/>
        5. Multi costume support is added.<br/>
        6. Written the flow in dynamic & scalable way for those features i have touched.<br/>
        <br/>

        <b>Adding a reference video on how to use the app i developed - <a href='https://drive.google.com/file/d/1aIZBRXxGba5ydUk4RymRoarSCni96mb8/view?usp=sharing' target={'_blank'}> Click here</a></b><br/>
        (https://drive.google.com/file/d/1aIZBRXxGba5ydUk4RymRoarSCni96mb8/view?usp=sharing)
        <br/>
        <br/>

        Due to time constrain, i tried to wrap this over weekend. Was on & off due to office commitment.<br/><br/>
        1. Not able to build all options of each module (i.e events, motion, looks). So added few important ones.<br/>
        2. Started with Vanilla js as the boilerplate was in th same.<br/>
        3. Would have optimized the logic with requestAnimationFrame(), but couldn't.<br/>

        <br/>
        <br/>
        Have prior experience in building a Surfer game in Vanilla js (for my prev company "CureSkin")<br/>
        Click here to - <a href={'https://skin-game.onrender.com/'} target={'_blank'}> Play Game </a><br/>
        Code - <a href={'https://github.com/yuvann/SkinSurfers-Game'} target={'_blank'}> https://github.com/yuvann/SkinSurfers-Game </a><br/>

      </div>
    </div>
  );
}
