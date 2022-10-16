import React from "react";

type ItemsPerPageProps = {
    options: number[];
    onChangeHandler: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    selectedOption: number;
    shouldDisable: boolean;
}

export class ItemsPerPage extends React.Component<ItemsPerPageProps> {
    render() {
        return (
            <>
                <select onChange={this.props.onChangeHandler} disabled={this.props.shouldDisable}>
                    {this.props.options.map(x => <option value={x} selected={this.props.selectedOption == x}>{x}</option>)}
                </select>
            </>
        )
    }
}