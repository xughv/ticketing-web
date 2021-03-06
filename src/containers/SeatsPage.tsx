import { connect } from 'react-redux';
import { goBack, push } from 'react-router-redux';
import { NavBar } from 'antd-mobile';
import { SelectSeats } from '../components/seats';
import { loadMovieDetail, loadShowInfo, loadCinemaList, loadSeatsInfo } from '../actions';

import * as React from 'react';
import '../components/seats/styles/index.sass';

export interface SeatsPageProps {
  goBack: Function,
  push: Function,
  loadMovieDetail: Function,
  loadShowInfo: Function,
  loadCinemaList: Function,
  loadSeatsInfo: Function,
  movieDetail: any,
  showInfo: any,
  cinemaList: any,
  seatsInfo: Array<any>,
  mid: number,
  cid: number,
  sid: number,
  sdate: string,
}

class SeatsPage extends React.Component<SeatsPageProps, any> {

  state = {
    selectedSeats : [],
  }

  select(seatNo: any) {
    let index = this.state.selectedSeats.indexOf(seatNo);
    if (index == -1) {
      this.state.selectedSeats.push(seatNo);
      this.setState({selectedSeats: this.state.selectedSeats});
    } else {
      this.state.selectedSeats.splice(index, 1);
      this.setState({selectedSeats: this.state.selectedSeats});
    }
    
  }

  componentDidMount() {
    this.props.loadMovieDetail(this.props.mid);
    this.props.loadCinemaList();
    // this.props.loadShowInfo(this.props.mid, this.props.cid);
    // this.props.loadSeatsInfo(this.props.sid, this.props.sdate);
  }

  getCinemaById(cinemaList: Array<any>, cid: number) {
    if (cinemaList.length > 0) {
      for (let i = 0; i < cinemaList.length; ++i) {
        if (cinemaList[i].id == cid) {
          return cinemaList[i];
        }
      }
    } else {
      return null;
    }
  }

  order() {
    if (!localStorage.orders) {
      localStorage.orders = '[]';
    }
    let orders = JSON.parse(localStorage.orders);
    orders.push({
      seats: this.state.selectedSeats,
      movieDetail: this.props.movieDetail,
      showInfo: this.props.showInfo,
      seatsInfo: this.props.seatsInfo,
      movieId: this.props.mid,
      cinemaId: this.props.cid,
      showId: this.props.sid,
      showDate: this.props.sdate
    });

    localStorage.orders = JSON.stringify(orders);
    this.props.push('/login');
  }

  render() {
    const { movieDetail, showInfo, cinemaList, seatsInfo, mid, cid, sid, sdate } = this.props;
    const cinema = this.getCinemaById(cinemaList, cid);
    return (
      <div id="seats-page">
        <NavBar iconName="left" onLeftClick={() => this.props.goBack()}>{ cinema ? cinema.nm : ""}</NavBar>
        <div className="movie">
          <button 
            className="btn btn-pay" 
            disabled={this.state.selectedSeats.length == 0}
            onClick={() => this.order()}>
            确认选座
          </button>
          <div className="info">
            <h3>{ movieDetail ? movieDetail.detail.nm : "" }</h3>
            <p>{ sdate }</p>
          </div>
        </div>
        <div className="tips">
          <ul className="seat-intro">
            <li>
              <span className="seat active"></span>可选
            </li>
            <li>
              <span className="seat selected"></span>已选
            </li>
            <li>
              <span className="seat disabled"></span>已售
            </li>
            <li>
              <span className="seat love"></span>情侣座
            </li>
          </ul>
        </div>
        <SelectSeats 
          seatsInfo={seatsInfo ? seatsInfo : []} 
          select={(seat) => this.select(seat)}
          selectedSeats={this.state.selectedSeats}/>
      </div>
    )
  }
}


function mapStateToProps(state, ownProps) {

  const {
    data: { movieDetail, showInfo, cinemaList, seatsInfo }
  } = state

  return {
    movieDetail,
    showInfo,
    cinemaList,
    seatsInfo,
    mid: ownProps.match.params.movieId,
    cid: ownProps.match.params.cinemaId,
    sid: ownProps.match.params.showId,
    sdate: ownProps.match.params.showDate
  }
}

export default connect(mapStateToProps, { loadMovieDetail, loadShowInfo, loadCinemaList, loadSeatsInfo, goBack, push })(SeatsPage);