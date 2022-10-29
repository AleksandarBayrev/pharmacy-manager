import { observer } from "mobx-react";
import React from "react";
import { ILanguageSelectorStore, ITranslationManager } from "../../../../../types";

type LoadingDataProps = {
    rerenderDotsInMs: number;
    languageSelectorStore: ILanguageSelectorStore;
    translationManager: ITranslationManager;
}
type LoadingDataState = {
    numberOfDots: number;
    rerenderDotsInMs: number;
}

@observer
export class LoadingData extends React.Component<LoadingDataProps, LoadingDataState> {
    private readonly dot = ".";
    private interval: NodeJS.Timer | null = null;
    constructor(props: LoadingDataProps) {
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
        return `${this.props.translationManager.getTranslation(this.props.languageSelectorStore.language.get(), "FORM_GET_MEDICINE_LOADING_DATA")}${dots}`;
    }
}