import React from "react";
import { observer } from "mobx-react";
import { IDateFormatter, IGetDateTimeStore, ITimeFormatter } from "../../types";

type DateTimeProps = {
    store: IGetDateTimeStore;
    timeFormatter: ITimeFormatter;
    dateFormatter: IDateFormatter;
    phrase?: string;
}

@observer
export class DateTime extends React.Component<DateTimeProps> {
    private updateInterval: NodeJS.Timer | undefined;
    constructor(props: DateTimeProps) {
        super(props);
    }

    componentDidMount(): void {
        this.updateInterval = setInterval(async () => {
            this.props.store.setDate(await this.getDateAsync());
        }, 50);
    }

    componentWillUnmount(): void {
        clearInterval(this.updateInterval);
    }

    private getDateAsync(): Promise<Date> {
        return Promise.resolve(new Date());
    }

    render() {
        const date = this.props.dateFormatter.getDateForDateTimeComponent(this.props.store.date.get());
        const time = this.props.timeFormatter.getTimeForDateTimeComponent(this.props.store.date.get());
        return (
            <div className="App-date-time-container">
                {this.props.phrase ? `${this.props.phrase}${date} ${time}` : `${date} ${time}`}
            </div>
        )
    }
}