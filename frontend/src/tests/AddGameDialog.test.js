import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import AddGameDialog from '../components/AddGameDialog';

configure({ adapter: new Adapter() });

describe('AddGameDialog component', () => {
  it('has new game name input text field', () => {
    const noop = () => {};
    const onFormSubmit = () => {};
    const wrapper = shallow(<AddGameDialog
      open
      setOpen={noop}
      onFormSubmit={onFormSubmit}
    />);
    expect(wrapper.find('#game-name').prop('aria-label')).toEqual('game name');
  });

  it('has new game thumbnail upload', () => {
    const noop = () => {};
    const onFormSubmit = () => {};
    const wrapper = shallow(<AddGameDialog
      open
      setOpen={noop}
      onFormSubmit={onFormSubmit}
    />);
    expect(wrapper.find('#thumbnail-upload').prop('aria-label')).toEqual('new game thumbnail upload');
  });

  it('has name as a required field', () => {
    const noop = () => {};
    const onFormSubmit = () => {};
    const wrapper = shallow(<AddGameDialog
      open
      setOpen={noop}
      onFormSubmit={onFormSubmit}
    />);
    expect(wrapper.find('#game-name').prop('required')).toEqual(true);
  });
});
