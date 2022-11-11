import "./CreationForm.css";
import React, { useState, useEffect } from "react";
import SharedWalletCreationForm from "../../components/CreationForms/SharedWalletCreationForm";
import CrowdfundingCreationForm from "../../components/CreationForms/CrowdfundingCreationForm";
import CommonPotCreationForm from "../../components/CreationForms/CommonPotCreationForm";

const BaseCreationForm = ({notifyWalletCreated}) => {

    const options = [
        { value: 'sharedWallet', label: 'Shared Wallet' },
        { value: 'crowdfunding', label: 'Crowdfunding' },
        { value: 'commonPot', label: 'Common Pot' }
    ];

    // State
    const [selectedOption, setSelectedOption] = useState(options[0].value);

    return (
        <div className="form-creation-container">
            <select
                value={selectedOption}
                onChange={e => setSelectedOption(e.target.value)}>
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>

            {
                // Selected type is Shared Wallet
                selectedOption == 'sharedWallet' &&
                <SharedWalletCreationForm notifyWalletCreated={notifyWalletCreated} />
            }

            {
                // Selected type is Crowdfunding
                selectedOption == 'crowdfunding' &&
                <CrowdfundingCreationForm notifyWalletCreated={notifyWalletCreated} />
            }

            {
                // Selected type is CommonPot
                selectedOption == 'commonPot' &&
                <CommonPotCreationForm notifyWalletCreated={notifyWalletCreated} />
            }
        </div>
    );
}

export default BaseCreationForm;
