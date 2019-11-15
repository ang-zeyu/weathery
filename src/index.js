import React from 'react';
import ReactDOM from 'react-dom';
import Weacompo from './wea_component.js';
import Spinner from './loading.js';
import {Row, Col, Container} from 'react-bootstrap';

class App extends React.Component {
    //f9655cc4f6b2e05ff5e3e6d316b0a1fd
    state = {
        longitude:null, latitude:null,
        user_blocked_location:null,
        weather:null, main_weather:null,
        sunset:null, sun_up:null, sun_down:null, night:null,
        time:null, sundown:null, sunrise:null
    };

     static async get_weather(component) {
        // console.log('getting weather');

        let has_position = new Promise(function recursive_chk(resolve,reject) {
            if (component.state.longitude != null) {
                resolve(1);
            } else if (component.state.user_blocked_location) {
                reject(0);
            } else {
                setTimeout(()=>{recursive_chk(resolve,reject);}, 100);
            }
        });
        const result = await has_position;
        console.log(result);
        if (result) {
            let prom_coord = fetch('http://api.openweathermap.org/data/2.5/weather?lat='
                + component.state.latitude + '&lon=' + component.state.longitude
                + '&appid=f9655cc4f6b2e05ff5e3e6d316b0a1fd');
            // console.log(prom_coord);
            const weatherres = await((await prom_coord).json());
            // console.log(weatherres);
            component.setState({sun_up:new Date(weatherres.sys.sunrise * 1000), sun_down:new Date(weatherres.sys.sunset * 1000)});
            var sunrisetime = component.state.sun_up.getHours() + ':' + component.state.sun_up.getMinutes();
            var sunsettime = component.state.sun_down.getHours() + ':' + component.state.sun_down.getMinutes();
            let currentTime = (new Date()).getTime() / 1000;
            let sundownTime = component.state.sun_down.getTime() / 1000;
            let sunupTime = component.state.sun_up.getTime() /1000;
            const sun_down_bool = currentTime > (sundownTime - 3600) && currentTime < (sundownTime + 3600);
            const sun_up_bool = currentTime > (sunupTime + 82800) && currentTime < (sunupTime + 90000);
console.log('hi' + sun_up_bool + sunupTime + currentTime)
            component.setState({weather:weatherres, main_weather:weatherres.weather[0].main, sunrise:sunrisetime, sunset:sunsettime, night:currentTime > (sundownTime + 3600)
                , time:currentTime, sunDown:sun_down_bool, sunUp:sun_up_bool});
        } else {
            alert('please allow location services');
        }
     }


    componentWillMount() {
        navigator.geolocation.getCurrentPosition(
            (location) => {this.setState({longitude:location.coords.longitude, latitude:location.coords.latitude});},
            () => {this.setState({user_blocked_location:true});console.log('unable to determine position');}
        );
    }

    componentDidMount() {
        App.get_weather(this);
    }

    getmain_weather(type) {
        if (type) {
            return this.state.main_weather === 'Clouds' ? ['cloudy.png', 'cloudy by Kirby Wu from the Noun Project'] : ['rain.png', 'Rain by Mat fine from the Noun Project.png'];
        } else {

            return {backgroundImage:this.state.sunDown
                ? 'url(./images/sunsetbg.jpg)'
                : this.state.sunUp
                    ? 'url(./images/sunrisebg.jpg)'
                    : this.state.night
                        ? 'url(./images/nightbg.jpg)'
                        : this.state.main_weather === 'Clear'
                            ? 'url(./images/clearbg.jpg)'
                                : this.state.main_weather === 'Clouds'
                                ? 'url(./images/cloudybg.png)'
                                    : 'url(./images/rainybg.png)'};
        }
    }

    render() {
        if (this.state.weather == null) {
            return <Spinner></Spinner>;
        } else {
            const timeofday = this.getmain_weather(true);
            return (<div id="weathergrid" style={this.getmain_weather(false)}>
                <Container>
                    <Row className='Weather_row'>
                        <Col xs={6}>
                            <Weacompo name='Weather' text={this.state.weather.weather[0].description} inverted={this.state.night ? true : false}
                                value={this.state.main_weather} imgsrc={'./images/' + timeofday[0]} imgalt={timeofday[1]}>
                            </Weacompo>
                        </Col>
                        <Col xs={6}>
                            <Weacompo name='Wind Speed' text={'Direction (Degrees): ' + this.state.weather.wind.deg} inverted={this.state.night ? true : false}
                                value={this.state.weather.wind.speed} imgsrc='./images/wind.png' imgalt='Wind by Andrejs Kirma from the Noun Project'>
                            </Weacompo>
                        </Col>
                    </Row>
                    <Row className='Weather_row'>
                        <Col xs={6}>
                            <Weacompo name='Location' text={<React.Fragment><p>{'Town : ' + this.state.weather.name}</p>
                                <p>Longitude: {this.state.longitude}</p><p>Latitude: {this.state.latitude}</p></React.Fragment>}
                                inverted={this.state.night ? true : false}
                                value = {this.state.weather.sys.country} imgsrc='./images/earth.png' imgalt='Earth by Payungkead Im-anong from the Noun Project'>
                            </Weacompo>
                        </Col>
                        <Col xs={6}>
                            <Row className="WeaCompo">
                                <Col xs={6}>
                                    <Weacompo name='Sunrise' value = {this.state.sunrise} text='' imgsrc='./images/sunrise.png' inverted={this.state.night ? true : false}
                                        imgalt='sunrise by Atif Arshad from the Noun Project.png'>
                                    </Weacompo>
                                </Col>
                                <Col xs={6}>
                                    <Weacompo name='Sunset' value={this.state.sunset} text='' imgsrc='./images/sunset.png' inverted={this.state.night ? true : false}
                                        imgalt='sunset by Ben Davis from the Noun Project.png'>
                                    </Weacompo>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='Weather_row'>
                        <Col xs={6}>
                            <Weacompo name='Atmospheric Pressure' value={this.state.weather.main.pressure + ' hpa'} text='' imgalt='pressure by Chameleon Design from the Noun Project.png' inverted={this.state.night ? true : false}
                                imgsrc='./images/pressure.png'>
                            </Weacompo>
                        </Col>
                        <Col xs={6}>
                            <Weacompo name='Temperature & Humidity' value={(this.state.weather.main.temp - 273.15).toFixed(1)} inverted={this.state.night ? true : false}
                                text={'Humidity : ' + this.state.weather.main.humidity + '%'}
                                imgsrc='./images/temperature.png' imgalt='Temperature by Made from the Noun Project.png'>
                            </Weacompo>
                        </Col>
                    </Row>
                </Container>
                </div>
                );
        }
    }
}

ReactDOM.render(<App/>, document.querySelector("#root"));

export default App;
