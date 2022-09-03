import React from "react";

type LoadingDataProps = {}
type LoadingDataState = {
    numberOfDots: number;
}

export class LoadingData extends React.Component<LoadingDataProps, LoadingDataState> {
    private readonly dot = ".";
    constructor(props: LoadingDataProps) {
        super(props);
        this.state = {
            numberOfDots: 1
        };
        setInterval(() => {
            this.setState({
                numberOfDots: this.state.numberOfDots + 1
            })
        }, 100);
    }
    render() {
        return <div className='App-data-loading'>{this.getMessage()}</div>
    }

    private getMessage() {
        let dots = this.dot.repeat(this.state.numberOfDots % 3 + 1);
        return `Loading data, please wait${dots}`;
    }
}