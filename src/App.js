import React from "react";
import Sidebar from "./components/sidebar";
import FlowBlocksViewComponent from "./components/FlowBlocksView/FlowBlocksView";
import './style.css';
import PreviewAreaComponent from "./components/PreviewArea/PreviewArea";
import {Link} from "react-router-dom";

export default function App() {
  return (
    <div className="bg-blue-100 font-sans">
      <div className={'dev-note'}>
        Hi <Link to={'/dev'} className={'text-blue-600'}> Click here read Developer note</Link>. Must Read !!!
      </div>
      <div className="h-screen overflow-hidden flex flex-row">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar /> <FlowBlocksViewComponent />
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl">
          <PreviewAreaComponent />
        </div>
      </div>
    </div>
  );
}
