import React from "react";

type DateTimeProps = {
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
        this.updateInterval = setInterval(() => {
            this.setState({
                date: new Date()
            });
        }, 50);
    }

    componentWillUnmount(): void {
        clearInterval(this.updateInterval);
    }

    private formatDate() {
        const day = this.state.date.getDate();
        const month = this.state.date.getMonth() + 1;
        const year = this.state.date.getFullYear();

        const dayFormatted = day < 10 ? `0${day}` : day;
        const monthFormatted = month < 10 ? `0${month}` : month;
        return `${dayFormatted}.${monthFormatted}.${year}`;
    }

    private formatTime() {
        const hours = this.state.date.getHours();
        const minutes = this.state.date.getMinutes();
        const seconds = this.state.date.getSeconds();

        const hoursFormatted = hours < 10 ? `0${hours}` : hours;
        const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
        const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;
        return `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`;
    }

    render() {
        return (
            <div className="App-date-time-container">
                {this.props.phrase ? `${this.props.phrase}${this.formatDate()} ${this.formatTime()}` : `${this.formatDate()} ${this.formatTime()}`}
            </div>
        )
    }
}