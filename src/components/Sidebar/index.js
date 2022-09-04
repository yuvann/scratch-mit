import React from "react";
import EventsComponent from "./event/events";
import MotionComponent from "./motion/motion";
import LookComponent from "./look/looks";

export default function Sidebar() {
    return (
        <div className="w-100 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
            <EventsComponent></EventsComponent>
            <MotionComponent></MotionComponent>
            <LookComponent></LookComponent>
        </div>
    );
}
