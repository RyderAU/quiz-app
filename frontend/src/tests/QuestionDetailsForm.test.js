import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import QuestionDetailsForm from '../components/QuestionDetailsForm';

configure({ adapter: new Adapter() });

describe('QuestionDetailsForm component', () => {
  it('has question type field with aria label', () => {
    const noop = () => {};
    const wrapper = shallow(<QuestionDetailsForm
      answers={[]}
      setAnswers={noop}
      question
      setQuestion={noop}
      questionType
      setQuestionType={noop}
      points
      setPoints={noop}
      timeLimit
      setTimeLimit={noop}
      questionResource
      setQuestionResource={noop}
      questionVideo
      setQuestionVideo={noop}
      setQuestionImage={noop}
    />);
    expect(wrapper.find('#question-type').prop('aria-label')).toEqual('question type');
  });

  it('has question type as required input', () => {
    const noop = () => {};
    const wrapper = shallow(<QuestionDetailsForm
      answers={[]}
      setAnswers={noop}
      question
      setQuestion={noop}
      questionType
      setQuestionType={noop}
      points
      setPoints={noop}
      timeLimit
      setTimeLimit={noop}
      questionResource
      setQuestionResource={noop}
      questionVideo
      setQuestionVideo={noop}
      setQuestionImage={noop}
    />);
    expect(wrapper.find('#question-type').prop('required')).toEqual(true);
  });
});
