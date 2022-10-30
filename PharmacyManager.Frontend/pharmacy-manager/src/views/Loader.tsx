import React from "react";
import { ISettingsStore, ILogger, ITranslationManager, Language } from "../types";
import loadingGif from '../shared/images/loading.gif';
import "./Loader.css";

type LoaderProps = {
    logger: ILogger;
    translationManager: ITranslationManager;
    SettingsStore: ISettingsStore;
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
        return <div className="Loader">
            <div><img src={loadingGif} /></div>
            <div>{this.props.translationManager.getTranslation(this.props.SettingsStore.language.get(), "LOADING_TEXT")}</div>
        </div>
    }
}