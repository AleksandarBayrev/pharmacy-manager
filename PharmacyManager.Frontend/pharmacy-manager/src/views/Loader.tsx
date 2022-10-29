import React from "react";
import { ILogger, ITranslationManager, Language } from "../types";
import "./Loader.css";

type LoaderProps = {
    logger: ILogger;
    translationManager: ITranslationManager;
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
        return <div className="Loader">{this.props.translationManager.getTranslation(Language.English, "LOADING_TEXT")}</div>
    }
}