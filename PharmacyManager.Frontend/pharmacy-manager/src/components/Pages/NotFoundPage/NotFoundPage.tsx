import React from "react";
import "../../Shared/Styles.css";

export type NotFoundPageProps = {}

export class NotFoundPage extends React.Component<NotFoundPageProps> {
    render() {
        return (
            <div className="App-page">
                <div className="App-page-header">Requested path was not found</div>
            </div>
        )
    }
}