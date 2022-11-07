// import React, {useState} from "react";
//
// const FormAddAllowance = (props) => {
//     const [addressAllowance, setAddressAllowance] = useState("");
//     const [amountAllowance, setAmountAllowance] = useState(0);
//
//
//     const handleSubmit = (e) => {
//         addFormLog([ addressAllowance, amountAllowance])
//         e.preventDefault();
//     }
//
//     return(
//         <form onSubmit={e => { handleSubmit(e) }}>
//             <label>
//                 Address of beneficiary
//                 <input
//                     name="addressAllowance"
//                     type="text"
//                     onChange={e => setAddressAllowance(e.target.value)}
//                     value={addressAllowance}
//                 />
//             </label>
//             <br/>
//             <label>
//                 Amount of allowance
//                 <input
//                     name="amountAllowance"
//                     type="text"
//                     onChange={e => setAmountAllowance(e.target.value)}
//                     value={amountAllowance}
//                 />
//             </label>
//             <input type="submit" value={"Add Allowance"}/>
//         </form>
//     )
// }
//
// export default FormAddAllowance;
