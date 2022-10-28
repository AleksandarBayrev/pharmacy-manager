import React from "react";
import { ILogger } from "../types";
import "./Loader.css";

type LoaderProps = {
    logger: ILogger;
}

export class Loader extends React.Component<LoaderProps> {
    constructor(props: LoaderProps) {
        super(props);
    }
    componentDidMount(): void {
        this.props.logger.Info("Rendering loader...");
    }
    componentWillUnmount(): void {
        this.props.logger.Info("Removing loader...");
    }
    render() {
        return <div className="Loader">Loading application...</div>
    }
}