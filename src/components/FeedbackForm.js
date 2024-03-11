import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/FeedbackForm.css';

const FeedbackForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [showFeedbackList, setShowFeedbackList] = useState(false); // State to toggle feedback list visibility
  const [updateFeedbackData, setUpdateFeedbackData] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedFeedback, setUpdatedFeedback] = useState('');

  const addFeedback = async () => {
    try {
      const response = await axios.post('http://192.168.111.170/johnsonweb/api/feedback', {
        Name: name,
        Email: email,
        FeedbackText: feedback
      });
      setName('');
      setEmail('');
      setFeedback('');
      alert('Feedback added successfully!');
      fetchFeedbackList();
    } catch (error) {
      console.error('Error adding feedback:', error);
      alert('Failed to add feedback. Please try again.');
    }
  };

  const fetchFeedbackList = async () => {
    try {
      const user = sessionStorage.getItem('username');
      if (user) {
        const response = await axios.get(`http://192.168.111.170/johnsonweb/api/feedback/?username=${user}`);
        setFeedbackList(response.data);
      }
    } catch (error) {
      console.error('Error fetching feedback list:', error);
    }
  };

  useEffect(() => {
    fetchFeedbackList();
  }, []);

  const toggleFeedbackList = () => {
    setShowFeedbackList(!showFeedbackList);
  };

  const deleteFeedback = async (id) => {
    try {
      await axios.delete(`http://192.168.111.170/johnsonweb/api/feedback`, {
        data: { Id: id }
      });
      alert('Feedback deleted successfully!');
      setFeedbackList(feedbackList.filter(feedback => feedback.id !== id));
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete feedback. Please try again.');
    }
  };

  const updateFeedback = async () => {
    try {
      const response = await axios.put(`http://192.168.111.170/johnsonweb/api/feedback/UpdateFeedback`, {
        Id: updateFeedbackData.id,
        // Name: updatedName || updateFeedbackData.name,
        Name: updateFeedbackData.name,
         Email: updateFeedbackData.email,
        // Email: updatedEmail || updateFeedbackData.email,
        FeedbackText: updatedFeedback || updateFeedbackData.feedbackText
      });
      alert('Feedback updated successfully!');
      fetchFeedbackList();
      setUpdateFeedbackData(null);
      setUpdatedName('');
      setUpdatedEmail('');
      setUpdatedFeedback('');
    } catch (error) {
      console.error('Error updating feedback:', error);
      alert('Failed to update feedback. Please try again.');
    }
  };

  return (
    <div className='container'>
      <h1 className='header'>Feedback Form</h1>
      <div className='form-container'>
        <form onSubmit={(e) => {
          e.preventDefault();
          addFeedback();
        }}>
          <div className='form-group'>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter your name...'
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email...'
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='feedback'>Feedback:</label>
            <textarea
              id='feedback'
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder='Enter your feedback...'
              rows='5'
              required
            ></textarea>
          </div>
          <div className='form-group'>
            <button type='submit' className='submit-button'>
              Add Feedback
            </button>
          </div>
        </form>
      </div>

      <button onClick={toggleFeedbackList} className='view-feedback-button'>
        View Feedback
      </button>

      {showFeedbackList && (
        <div className='feedback-list-container'>
          <h2>Feedback List</h2>
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Feedback</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.map((feedback, index) => (
                <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                  <td>{feedback.id}</td>
                  <td>{feedback.name}</td>
                  <td>{feedback.email}</td>
                  <td>{feedback.feedbackText}</td>
                  <td>
                    <button onClick={() => deleteFeedback(feedback.id)}>Delete</button>
                    <button onClick={() => setUpdateFeedbackData(feedback)}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {updateFeedbackData && (
        <div className='update-modal'>
          <h2>Update Feedback</h2>
          <div>
            <label>ID:</label>
            <input type='text' value={updateFeedbackData.id} readOnly />
          </div>
          <div>
            <label>Name:</label>
            <input type='text' value={updateFeedbackData.name} readOnly />

            {/* <input type='text' value={updatedName || updateFeedbackData.name} onChange={(e) => setUpdatedName(e.target.value)} /> */}
          </div>
          <div>
            <label>Email:</label>
            <input type='text' value={updateFeedbackData.email} readOnly />

            {/* <input type='email' value={updatedEmail || updateFeedbackData.email} onChange={(e) => setUpdatedEmail(e.target.value)} /> */}
          </div>
          <div>
            <label>Feedback:</label>
            <textarea rows='5' value={updatedFeedback || updateFeedbackData.feedbackText} onChange={(e) => setUpdatedFeedback(e.target.value)} />
          </div>
          <button onClick={updateFeedback}>Update</button>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
