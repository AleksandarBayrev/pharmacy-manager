import React from "react";
import { IDateFormatter, ITimeFormatter } from "../../../types";

type DateTimeProps = {
    timeFormatter: ITimeFormatter;
    dateFormatter: IDateFormatter;
    phrase?: string;
}

type DateTimeState = {
    date: Date;
}

export class DateTime extends React.Component<DateTimeProps, DateTimeState> {
    private updateInterval: NodeJS.Timer | undefined;
    constructor(props: DateTimeProps) {
        super(props);
        this.state = {
            date: new Date()
        };
    }

    componentDidMount(): void {
        this.updateInterval = setInterval(async () => {
            this.setState({
                date: await this.getDateAsync()
            });
        }, 50);
    }

    componentWillUnmount(): void {
        clearInterval(this.updateInterval);
    }

    private getDateAsync(): Promise<Date> {
        return Promise.resolve(new Date());
    }

    render() {
        const date = this.props.dateFormatter.getDateForDateTimeComponent(this.state.date);
        const time = this.props.timeFormatter.getTimeForDateTimeComponent(this.state.date);
        return (
            <div className="App-date-time-container">
                {this.props.phrase ? `${this.props.phrase}${date} ${time}` : `${date} ${time}`}
            </div>
        )
    }
}