import React from "react";
import { observer } from "mobx-react";
import { IGetMedicineListPageStore, MedicineRequest } from "../../../types";
import { ItemsPerPage } from "./pageComponents/ItemsPerPage";
export type PageSettingsProps = {
    store: IGetMedicineListPageStore;
}

@observer
export class PageSettings extends React.Component<PageSettingsProps> {
    private textChangeTimeout: NodeJS.Timeout | undefined = undefined;

    render() {
        return (
            <div id="App-page-settings">
                <div className='App-page-row-setting'>
                    <div className='row'>
                        <div className='column'><input id='only-available-medicines' type="checkbox" checked={this.props.store.request.availableOnly} disabled={this.props.store.loadingData.get()} onChange={(e) => this.onCheckboxChange(e, "availableOnly")} /></div>
                        <label className='column' htmlFor='only-available-medicines'>Show only available medicines</label>
                    </div>
                </div>
                <div className='App-page-row-setting'>
                    <div className='row'>
                        <div className='column'><input id='only-not-expired-medicines' type="checkbox" checked={this.props.store.request.notExpired} disabled={this.props.store.loadingData.get()} onChange={(e) => this.onCheckboxChange(e, "notExpired")} /></div>
                        <label className='column' htmlFor='only-not-expired-medicines'>Show only not expired medicines</label>
                    </div>
                </div>
                <div className='App-page-row-setting'>
                    <div className='row'>
                        <div className='column'>Page</div>
                        <div className='column'><input type="text" onChange={this.onPageChange} placeholder={'Page'} value={this.props.store.request.page} disabled={this.props.store.loadingData.get()} />
                        </div>
                    </div>
                </div>
                <div className='App-page-row-setting'>
                    <div className='row'>
                        <div className='column'>Items Per Page</div>
                        <div className='column'>{this.getItemsPerPageComponent(this.onSelectChange, this.props.store.request.itemsPerPage, this.props.store.loadingData.get())}</div>
                    </div>
                </div>
                <div className='App-page-row-setting'>
                    <div className='row'>
                        <div className='column'>Manufacturer</div>
                        <div className='column'>{this.renderTextBox((e) => this.onTextChange(e, "manufacturer"), "Manufacturer", this.props.store.request.manufacturer, this.props.store.loadingData.get())}</div>
                    </div>
                </div>
                <div className='App-page-row-setting'>
                    <div className='row'>
                        <div className='column'><button onClick={this.props.store.resetRequestToDefaults} disabled={this.props.store.loadingData.get()}>Reset to default request</button></div>
                    </div>
                </div>
                <div className='App-page-row-setting'>
                    <div className='row'>
                        <div className='column'>{this.renderPageCountText(this.props.store.showPageCount.get(), this.props.store.pages.get())}</div>
                    </div>
                </div>
            </div>
        )
    }

    private getItemsPerPageComponent(
        onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
        itemsPerPage: number,
        loadingData: boolean
    ) {
        const options: number[] = [10, 15, 20, 50, 100, 500];
        return <ItemsPerPage
            options={options}
            onChangeHandler={onSelectChange}
            selectedOption={itemsPerPage}
            shouldDisable={loadingData} />;
    }

    private renderPageCountText(showPageCount: boolean, pages: number) {
        return showPageCount ? `Avaliable pages: ${pages}` : 'Loading page count...';
    }
    
    private renderTextBox(textChangeHandler: (
        e: React.ChangeEvent<HTMLInputElement>) => void,
        placeholder: string,
        value: string,
        disabled: boolean) {
        return <input type="text" onChange={textChangeHandler} placeholder={placeholder} value={value} disabled={disabled} />
    }

    private onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const updatedProp: Partial<MedicineRequest> = {};
      updatedProp["itemsPerPage"] = parseInt(e.target.value);
      this.props.store.updateRequestProperties(updatedProp);
      this.props.store.stopUpdateInterval();
      this.props.store.refetch(false);
    }
  
    private onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, prop: "availableOnly" | "notExpired") => {
      const updatedProp: Partial<MedicineRequest> = {};
      updatedProp[prop] = e.target.checked;
      this.props.store.updateRequestProperties(updatedProp);
      this.props.store.stopUpdateInterval();
      this.props.store.refetch(false);
    }
  
    private onTextChange = async (e: React.ChangeEvent<HTMLInputElement>, prop: "manufacturer") => {
      const updatedProp: Partial<MedicineRequest> = {};
      updatedProp[prop] = e.target.value;
      this.props.store.updateRequestProperties(updatedProp);
      if (this.textChangeTimeout) {
        clearTimeout(this.textChangeTimeout);
        this.props.store.stopUpdateInterval();
      }
      this.textChangeTimeout = setTimeout(() => {
        this.props.store.refetch(true);
      }, 1000);
    }
  
    private onPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedProp: Partial<MedicineRequest> = {};
      updatedProp["page"] = parseInt(e.target.value);
      this.props.store.updateRequestProperties(updatedProp);
      this.props.store.stopUpdateInterval();
      this.props.store.refetch(false);
    }
}