module.exports = `<div class="container">
    <div class="row main">
        <div class="panel-heading">
            <div class="panel-title text-center">
                <img width="100" src="img/xmpp.svg" alt="XMPP Client" />
                <hr />
            </div>
        </div>
        <div class="main-login main-center">
            <form id="login-form" class="form-horizontal" method="post" action="#">
                <div class="form-group">
                    <label for="id" class="cols-sm-2 control-label">Jabber-ID</label>
                    <div class="cols-sm-10">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-user fa" aria-hidden="true"></i></span>
                            <input type="id" class="form-control" name="id" id="id" placeholder="user@example.com" required/>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="password" class="cols-sm-2 control-label">Password</label>
                    <div class="cols-sm-10">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-lock fa-lg" aria-hidden="true"></i></span>
                            <input type="password" class="form-control" name="password" id="password"  placeholder="Enter your Password" required/>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="bosh" class="cols-sm-2 control-label">BOSH</label>
                    <div class="cols-sm-10">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-user fa" aria-hidden="true"></i></span>
                            <input type="bosh" class="form-control" name="bosh" id="bosh" placeholder="https://example.com:5280/http-bind" required/>
                        </div>
                    </div>
                </div>

                <div class="form-group ">
                    <button type="submit" class="btn btn-primary btn-lg btn-block">Login</button>
                </div>
            </form>
        </div>
    </div>
</div>`;
