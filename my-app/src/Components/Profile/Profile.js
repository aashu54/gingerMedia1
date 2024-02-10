import React from "react";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import profileStyle from './Profile.module.css';

const Profile = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { state: { email } } = location;
        const response = await fetch(`http://localhost:3001/api/user/profile?email=${encodeURIComponent(email)}`);
        if (!response.ok) {
          console.log(await response.json);
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [location]);


  return (
    <div className={profileStyle.profile}>
      <h1>Welcome to profile!!</h1>
      <div>
        {userData ? (
          <div>
            <p className={profileStyle.fields}>Email: {userData.email}</p>
            <p className={profileStyle.fields}>Name: {userData.name}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};
export default Profile;
