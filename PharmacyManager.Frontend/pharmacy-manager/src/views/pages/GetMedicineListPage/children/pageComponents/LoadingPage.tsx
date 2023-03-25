
import { observer } from "mobx-react";
import React from "react";
import { IAppStore, ITranslationManager } from "../../../../../types";

type LoadingPageProps = {
    rerenderDotsInMs: number;
    pageNumber: number;
    appStore: IAppStore;
    translationManager: ITranslationManager;
}
type LoadingPageState = {
    numberOfDots: number;
    rerenderDotsInMs: number;
}

@observer
export class LoadingPage extends React.Component<LoadingPageProps, LoadingPageState> {
    private readonly dot = ".";
    private interval: NodeJS.Timer | null = null;
    constructor(props: LoadingPageProps) {
        super(props);
        this.state = {
            numberOfDots: 1,
            rerenderDotsInMs: props.rerenderDotsInMs
        };
    }

    componentDidMount(): void {
        this.interval = setInterval(() => {
            this.setState({
                numberOfDots: this.state.numberOfDots + 1
            });
        }, this.state.rerenderDotsInMs);
    }

    componentWillUnmount(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    render() {
        return <div className='App-data-loading'>{this.getMessage()}</div>
    }

    private getMessage() {
        let dots = this.dot.repeat(this.state.numberOfDots % 3 + 1);
        return `${this.props.translationManager.getTranslation(this.props.appStore.language.get(), "FORM_GET_MEDICINE_LOADING_PAGE")} ${this.props.pageNumber}${dots}`;
    }
}