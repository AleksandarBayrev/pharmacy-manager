import React from "react";
import "./Loader.css";
export class Loader extends React.Component {
    componentDidMount(): void {
        console.log("Rendering loader...");
    }
    componentWillUnmount(): void {
        console.log("Removing loader...");
    }
    render() {
        return <div className="Loader">Loading application...</div>
    }
}