import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import GameStoppedAlert from '../components/GameStoppedAlert';

configure({ adapter: new Adapter() });

describe('GameStoppedAlert component', () => {
  it('has correct text being displayed', () => {
    const noop = () => {};
    const wrapper = shallow(<GameStoppedAlert
      gameStopAlert
      setGameStopAlert={noop}
      sessionId={1234}
    />);
    expect(wrapper.find('#alert-msg').text()).toEqual('Game over - Would you like to view the results?');
  });

  it('has button with aria label', () => {
    const noop = () => {};
    const wrapper = shallow(<GameStoppedAlert
      gameStopAlert
      setGameStopAlert={noop}
      sessionId={1234}
    />);
    expect(wrapper.find('#view-results-button').prop('aria-label')).toEqual('view results button');
  });
});
