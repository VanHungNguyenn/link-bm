import React, { Component, Fragment } from "react";
import OTPAuth from "otpauth";

class Getotp extends Component {
  state = {
    private_key: "",
    ma2fa: "",
    time_active: 0,
    hihi: null
  };
  getCurrentSeconds = () => {
    return Math.round(new Date().getTime() / 1000.0);
  };
  onChange = e => {
    this.setState({
      private_key: e.target.value
    });
  };
  intervalne = () => {
    return setInterval(() => {
      try {
        if (!this.state.private_key) return;
        let hihi = new OTPAuth.TOTP({
          algorithm: "SHA1",
          digits: 6,
          period: 30,
          secret: OTPAuth.Secret.fromB32(
            this.state.private_key.replace(/\s/g, "")
          )
        }).generate();
        this.setState({
          ma2fa: hihi,
          time_active: 30 - (this.getCurrentSeconds() % 30)
        });
      } catch {}
    }, 1000);
  };
  componentWillUnmount() {
    clearInterval(window.hihi);
  }
  componentDidMount() {
    window.hihi = this.intervalne();
  }
  render() {
    return (
      <Fragment>
        <div className="bg-body-light">
          <div className="content content-full">
            <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
              <h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
                Lấy mã OTP 2FA
              </h1>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="block block-rounded">
                <div className="block-content">
                  <div className="form-group">
                    <label>Private key</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={this.onChange}
                      placeholder="Nhập mã private key.."
                    />
                  </div>
                  <div className="form-group text-center">
                    {this.state.ma2fa ? (
                      <div>
                        <p
                          style={{
                            fontSize: "60px",
                            fontWeight: "700",
                            color: "blue"
                          }}
                        >
                          {this.state.ma2fa}
                        </p>
                        <p>
                          Mã còn hoạt động trong <b>{this.state.time_active}</b>
                          s
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Getotp;
