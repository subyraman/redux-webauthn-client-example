import * as React from 'react'
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {WebauthnActions, WebauthnActionTypes, WebauthnState} from 'redux-webauthn';
import Alert from 'reactstrap/lib/Alert';

function mapDispatchToProps(dispatch: Dispatch<WebauthnActionTypes>) {
    return {
      onRegister: () => dispatch(WebauthnActions.webauthnCreateCredentialRequest(credentialOptions)),
    }
}

type DispatchProps = ReturnType<typeof mapDispatchToProps>
interface RegistrationProps extends WebauthnState, DispatchProps {}


const Registration = (props: RegistrationProps) => {
    return (
        <div>
            <h2>Register a credential:</h2>
            <div className="mb-2">
                <button onClick={props.onRegister}>Register</button>
            </div>
            {props.createCredentialError && 
                <div className="mt-3">
                    <Alert color="danger">
                        Error when creating credential: {props.createCredentialError}
                    </Alert>
                </div>
            }

            {props.newCredential && 
                <div className="mt-3">
                    <Alert>
                        Credential created!
                    </Alert> 
                    <Alert className="mt-3" color="warning">
                        Warning: This credential has not been validated on the server. In an actual WebAuthn application, new credentials <b>must</b>{' '}
                        be validated for critical security reasons. See the{' '}
                        <a target="_blank" href="https://github.com/subyraman/redux-webauthn/tree/master/demo/redux-webauthn-react-typescript-example">Redux-Webauthn Server Example</a> for an
                        example.
                    </Alert>
                </div>
            }
        </div>
    );
}

const credentialOptions: PublicKeyCredentialCreationOptions = {
    challenge: window.crypto.getRandomValues(new Uint8Array(32)),
    pubKeyCredParams: [{alg: -7, 'type': 'public-key'}],
    rp: {
        id: 'subyraman.github.io',
        name: "subyraman.github.io"
    },
    user: {
        displayName: 'displayName',
        id: new Uint8Array(32).buffer,
        name: 'username',
    },
}


export default connect(
    (state) => state,
    mapDispatchToProps,
)(Registration)