import * as React from 'react'
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {WebauthnActions, WebauthnActionTypes, webauthnB64ToArrayBuffer} from 'redux-webauthn';
import { WebauthnState } from 'redux-webauthn';
import Fade from 'reactstrap/lib/Fade';
import Alert from 'reactstrap/lib/Alert';

type DispatchProps = ReturnType<typeof mapDispatchToProps>

interface AuthenticationProps extends DispatchProps, WebauthnState {}

function mapDispatchToProps(dispatch: Dispatch<WebauthnActionTypes>) {
    return {
      onAuthenticate: (newCredential: WebauthnState['newCredential']) => {
        if (newCredential) {
            const {id} = newCredential;
            const idAsArrayBuffer = webauthnB64ToArrayBuffer(id);

            const publicKeyRequestOptions: PublicKeyCredentialRequestOptions = {
              challenge: window.crypto.getRandomValues(new Uint8Array(32)),
              allowCredentials: [
                {id: idAsArrayBuffer, type: 'public-key'},
              ]
            }

            dispatch(WebauthnActions.webauthnGetAssertionRequest(publicKeyRequestOptions));
        };
      }
    }
}


const Authentication = (props: AuthenticationProps) => {
    return (
        <Fade in={!!props.newCredential}>
            <div className={"border-top pt-3"}>
                <h2>Authenticate with your credential:</h2>
                <div>
                    <button onClick={() => props.onAuthenticate(props.newCredential)}>Sign In</button>
                </div>
            </div>

            {props.getAssertionError && 
                <div className="mt-3">
                    <Alert color="danger">
                        Error when creating credential: {props.getAssertionError}
                    </Alert>
                </div>
            }

            {props.newAssertion && 
                <div className="mt-3">
                    <Alert>
                        Authentication assertion created!
                    </Alert> 
                    <Alert className="mt-3" color="warning">
                        Warning: This authentication assertion has not been validated on the server. In an actual WebAuthn application, assertions <b>must</b>{' '}
                        be validated for critical security reasons. See the{' '}
                        <a target="_blank" href="https://github.com/subyraman/redux-webauthn/tree/master/demo/redux-webauthn-react-typescript-example">Redux-Webauthn Server Example</a> for an
                        example.
                    </Alert>
                </div>
            }
        </Fade>
    );
}


export default connect(
    (state) => state,
    mapDispatchToProps,
)(Authentication)