import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// 参考書関連のAPI
export const getBooks = async () => {
  try {
    const response = await axios.get(`${API_URL}/books`);
    return response.data;
  } catch (error) {
    console.error('参考書情報の取得中にエラーが発生しました', error);
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/books/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}の参考書情報の取得中にエラーが発生しました`, error);
    throw error;
  }
};

export const createBook = async (bookData) => {
  try {
    const response = await axios.post(`${API_URL}/books`, bookData);
    return response.data;
  } catch (error) {
    console.error('参考書の作成中にエラーが発生しました', error);
    throw error;
  }
};

export const updateBook = async (id, bookData) => {
  try {
    const response = await axios.put(`${API_URL}/books/${id}`, bookData);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}の参考書情報の更新中にエラーが発生しました`, error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/books/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}の参考書情報の削除中にエラーが発生しました`, error);
    throw error;
  }
};

// 試験関連のAPI
export const getExams = async () => {
  try {
    const response = await axios.get(`${API_URL}/exams`);
    return response.data;
  } catch (error) {
    console.error('試験情報の取得中にエラーが発生しました', error);
    throw error;
  }
};

export const getExamById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/exams/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}の試験情報の取得中にエラーが発生しました`, error);
    throw error;
  }
};

export const getExamsByDate = async (startDate, endDate) => {
  try {
    let url = `${API_URL}/exams/date-range`;
    const params = {};
    
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('期間指定での試験情報の取得中にエラーが発生しました', error);
    throw error;
  }
};

export const createExam = async (examData) => {
  try {
    const response = await axios.post(`${API_URL}/exams`, examData);
    return response.data;
  } catch (error) {
    console.error('試験情報の作成中にエラーが発生しました', error);
    throw error;
  }
};

export const updateExam = async (id, examData) => {
  try {
    const response = await axios.put(`${API_URL}/exams/${id}`, examData);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}の試験情報の更新中にエラーが発生しました`, error);
    throw error;
  }
};

export const deleteExam = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/exams/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}の試験情報の削除中にエラーが発生しました`, error);
    throw error;
  }
};

// ユーザー関連のAPI
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('ユーザー情報の取得中にエラーが発生しました', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}のユーザー情報の取得中にエラーが発生しました`, error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error('ユーザーの作成中にエラーが発生しました', error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}のユーザー情報の更新中にエラーが発生しました`, error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}のユーザー情報の削除中にエラーが発生しました`, error);
    throw error;
  }
};

// リマインダー関連のAPI
export const getReminders = async () => {
  try {
    const response = await axios.get(`${API_URL}/reminders`);
    return response.data;
  } catch (error) {
    console.error('リマインダー情報の取得中にエラーが発生しました', error);
    throw error;
  }
};

export const getReminderById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/reminders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}のリマインダー情報の取得中にエラーが発生しました`, error);
    throw error;
  }
};

export const getUserReminders = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/reminders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`ユーザーID: ${userId}のリマインダー情報の取得中にエラーが発生しました`, error);
    throw error;
  }
};

export const getExamReminders = async (examId) => {
  try {
    const response = await axios.get(`${API_URL}/reminders/exam/${examId}`);
    return response.data;
  } catch (error) {
    console.error(`試験ID: ${examId}のリマインダー情報の取得中にエラーが発生しました`, error);
    throw error;
  }
};

export const createReminder = async (reminderData) => {
  try {
    const response = await axios.post(`${API_URL}/reminders`, reminderData);
    return response.data;
  } catch (error) {
    console.error('リマインダーの作成中にエラーが発生しました', error);
    throw error;
  }
};

export const updateReminder = async (id, reminderData) => {
  try {
    const response = await axios.put(`${API_URL}/reminders/${id}`, reminderData);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}のリマインダー情報の更新中にエラーが発生しました`, error);
    throw error;
  }
};

export const deleteReminder = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/reminders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}のリマインダー情報の削除中にエラーが発生しました`, error);
    throw error;
  }
};

// 学習記録関連のAPI
export const getStudyLogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/study-logs`);
    return response.data;
  } catch (error) {
    console.error('学習記録の取得中にエラーが発生しました', error);
    throw error;
  }
};

export const getStudyLogById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/study-logs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}の学習記録の取得中にエラーが発生しました`, error);
    throw error;
  }
};

export const getUserStudyLogs = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/study-logs/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`ユーザーID: ${userId}の学習記録の取得中にエラーが発生しました`, error);
    throw error;
  }
};

export const getBookStudyLogs = async (bookId) => {
  try {
    const response = await axios.get(`${API_URL}/study-logs/book/${bookId}`);
    return response.data;
  } catch (error) {
    console.error(`参考書ID: ${bookId}の学習記録の取得中にエラーが発生しました`, error);
    throw error;
  }
};

export const getStudyLogsByDateRange = async (startDate, endDate, userId) => {
  try {
    let url = `${API_URL}/study-logs/date-range`;
    const params = {};
    
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (userId) params.userId = userId;
    
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('期間指定での学習記録の取得中にエラーが発生しました', error);
    throw error;
  }
};

export const getUserStudyStats = async (userId, period) => {
  try {
    let url = `${API_URL}/study-logs/stats/user/${userId}`;
    const params = {};
    
    if (period) params.period = period;
    
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`ユーザーID: ${userId}の学習統計情報の取得中にエラーが発生しました`, error);
    throw error;
  }
};

export const createStudyLog = async (studyLogData) => {
  try {
    const response = await axios.post(`${API_URL}/study-logs`, studyLogData);
    return response.data;
  } catch (error) {
    console.error('学習記録の作成中にエラーが発生しました', error);
    throw error;
  }
};

export const updateStudyLog = async (id, studyLogData) => {
  try {
    const response = await axios.put(`${API_URL}/study-logs/${id}`, studyLogData);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}の学習記録の更新中にエラーが発生しました`, error);
    throw error;
  }
};

export const deleteStudyLog = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/study-logs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}の学習記録の削除中にエラーが発生しました`, error);
    throw error;
  }
};

// マイルストーン関連のAPI
export const getMilestones = async () => {
  try {
    const response = await axios.get(`${API_URL}/milestones`);
    return response.data;
  } catch (error) {
    console.error('マイルストーン情報の取得中にエラーが発生しました', error);
    throw error;
  }
};

export const getMilestoneById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/milestones/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}のマイルストーン情報の取得中にエラーが発生しました`, error);
    throw error;
  }
};

export const getUserMilestones = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/milestones/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`ユーザーID: ${userId}のマイルストーン情報の取得中にエラーが発生しました`, error);
    throw error;
  }
};

export const getExamMilestones = async (examId) => {
  try {
    const response = await axios.get(`${API_URL}/milestones/exam/${examId}`);
    return response.data;
  } catch (error) {
    console.error(`試験ID: ${examId}のマイルストーン情報の取得中にエラーが発生しました`, error);
    throw error;
  }
};

export const getCompletedMilestones = async (userId) => {
  try {
    let url = `${API_URL}/milestones/completed`;
    const params = {};
    
    if (userId) params.userId = userId;
    
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('完了したマイルストーン情報の取得中にエラーが発生しました', error);
    throw error;
  }
};

export const getPendingMilestones = async (userId) => {
  try {
    let url = `${API_URL}/milestones/pending`;
    const params = {};
    
    if (userId) params.userId = userId;
    
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('未完了のマイルストーン情報の取得中にエラーが発生しました', error);
    throw error;
  }
};

export const createMilestone = async (milestoneData) => {
  try {
    const response = await axios.post(`${API_URL}/milestones`, milestoneData);
    return response.data;
  } catch (error) {
    console.error('マイルストーンの作成中にエラーが発生しました', error);
    throw error;
  }
};

export const updateMilestone = async (id, milestoneData) => {
  try {
    const response = await axios.put(`${API_URL}/milestones/${id}`, milestoneData);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}のマイルストーン情報の更新中にエラーが発生しました`, error);
    throw error;
  }
};

export const deleteMilestone = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/milestones/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id}のマイルストーン情報の削除中にエラーが発生しました`, error);
    throw error;
  }
};
