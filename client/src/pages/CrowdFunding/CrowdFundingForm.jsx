import Button from '@mui/material/Button';
import {InputAdornment, TextField} from "@mui/material";

function CrowdFundingForm ({submitAction, setAction, fieldType, buttonTitle, fieldDescription}) {

    return(
        <form onSubmit={submitAction}>
            <Button variant="contained" type="submit" >{buttonTitle}</Button>

            <TextField id="outlined-basicTextField " variant="standard"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{fieldDescription}</InputAdornment>,
                        style: {
                            marginLeft: 20
                        }
                    }}
                    type={fieldType}
                    onChange={e => setAction(e.target.value)}
            />
        </form>
    )
}

export default CrowdFundingForm;