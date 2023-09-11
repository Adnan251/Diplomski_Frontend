import React, {useState, useEffect, ChangeEvent} from 'react';
import Navbar from '../components/Navbar';
import Input from '../components/Input'
import Modal from '../components/Modal';
import Button from '../components/Button';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const config = require('../config');
const { app: { host, port} } = config;

const Dashboard = () => {
  const [houseList, setHouseList] = useState([]);
  const [logsList, setLogsList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [devicesList, setDevicesList] = useState([]);
  const [currentHouse, setCurrentHouse] = useState('');
  const [currentHouseId, setCurrentHouseId] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [currentRoomId, setCurrentRoomId] = useState('');

  const [devicesListShow, setDevicesListShow] = useState(false);

  const [houseListShow, setHouseListShow] = useState(true);
  const [logsListShow, setLogsListShow] = useState(false);

  const handleLogsListShow = () => {
    setLogsListShow(true);
    setHouseListShow(false);
    setDevicesListShow(false);
    if(currentThermostatId !== '') {
      turnOffThermostat();
    }
    if(currentDoorId !== '') {
      turnOffDoor();
    }
    if(currentLightId !== '') {
      turnOffLight();
    }
    fetchLogsList();
  }

  const handleHouseListShow = () => {
    setLogsListShow(false);
    setHouseListShow(true);
    setDevicesListShow(false);
    if(currentThermostatId !== '') {
      turnOffThermostat();
    }
    if(currentDoorId !== '') {
      turnOffDoor();
    }
    if(currentLightId !== '') {
      turnOffLight();
    }
  }

  // ROOM Manage

  // Adding New House
  const [newRoomModal, setNewRoomModal] = useState(false);

  const handleHideNewRoomModal = () => {
    setNewRoomModal(false);
  }

  const [newRoomName, setNewRoomName] = useState('');

  const handleNewRoomName = (event) => {
    setNewRoomName(event.target.value);
  }

  const [floor, setFloor] = useState('');

  const handleRoomFloor = (event) => {
    setFloor(event.target.value);
  }

  const [roomType, setRoomType] = useState('');

  const handleRoomType = (event) => {
    setRoomType(event.target.value);
  }

  // Add House Function
  const addRoom = async () => {
    try {
      const response = await axios.post(
        `https://${host}/api/rooms/add`,
        { 
          room_name: newRoomName,
          floor: floor,
          room_type: roomType,
          house_id : currentHouseId,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      setNewRoomName('');
      setFloor('');
      setRoomType('');
      setNewRoomModal(false);
      showRooms(currentHouseId, currentHouse);
      toast.success('Room Added!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error room adding!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  const showRooms = async (index, house_name) => {
    try {
      setCurrentHouse(house_name);
      setCurrentHouseId(index);
      console.log(index);
      const response = await axios.post(
        `https://${host}/api/rooms/getAll`,
        { house_id: index }, // Send house_id in the request body
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );
      
      setRoomList(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Managin Rooms

  const [manageRoomModal, setManageRoomModal] = useState(false);
  const [deleteRoomModal, setDeleteRoomModal] = useState(false);
  const [editRoomModal, setEditRoomModal] = useState(false);
  const [currentRoomManageId, setCurrentRoomManageId] = useState('');

  const manageRoom = async (index) => {
    setManageRoomModal(true);
    setCurrentRoomManageId(index);
  }

  const deleteRoom = async () => {

    try {
      const response = await axios.delete(
        `https://${host}/api/rooms/delet`,
        {
          data: {
            id: currentRoomManageId,
          },
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );
  
      setCurrentRoomManageId('');
      showRooms(currentHouseId,currentHouse);
      handleHideDeleteRoomModal();
      toast.success('Room deleted!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error('Error deleting Room:', error);
      toast.error('Error deleting Room!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleHideManageRoomModal = () => {
    setManageRoomModal(false);
  }

  // Delete Room Modal Functions

  const handleDeleteRoomModal = () => {
    setManageRoomModal(false);
    setDeleteRoomModal(true);
  }

  const handleHideDeleteRoomModal = () => {
    setDeleteRoomModal(false);
  }

  // Edit Room Modal Functions
  const handleEditRoomModal = () => {
    setManageRoomModal(false);
    setEditRoomModal(true);
  }

  const handleHideEditRoomModal = () => {
    setEditRoomModal(false);
  }

  const updateRoom = async (updatedRoomData) => {
    try {
      const response = await axios.put(
        `https://<<<${host}:${port}/api/rooms/update`,
        updatedRoomData,
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );
  
      console.log('Room updated:', response.data);
      setNewRoomName('');
      setFloor('');
      setRoomType('');
      setEditRoomModal(false);
      showRooms(currentHouseId, currentHouse);
      toast.success('Room Updated!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
  
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error('Error updating room!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  
  const handleUpdateRoom = async () => {
    const updatedRoomData = {
      ...(newRoomName && { room_name: newRoomName }),
      ...(floor && { floor: floor }),
      ...(roomType && { room_type: roomType }),
      house_id: currentHouseId,
      id: currentRoomManageId
    };
  
    if (Object.keys(updatedRoomData).length === 1) { // Only house_id
      console.error('No fields to update');
      return;
    }
  
    updateRoom(updatedRoomData);
    setNewRoomModal(false);
  };










  // HOUSE Manage

  // Adding New House
  const [newHouseModal, setNewHouseModal] = useState(false);

  const handleHideNewHouseModal = () => {
    setNewHouseModal(false);
  }

  const [newHouseName, setNewHouseName] = useState('');

  const handleNewHouseName = (event) => {
    setNewHouseName(event.target.value);
  }

  const [address, setAddress] = useState('');

  const handleHouseAddress = (event) => {
    setAddress(event.target.value);
  }

  const [housePassword, setHousePassword] = useState('');

  const handleHousePassword = (event) => {
    setHousePassword(event.target.value);
  }

  const [confirmHousePassword, setConfirmHousePassword] = useState('');

  const handleConfirmHousePassword = (event) => {
    setConfirmHousePassword(event.target.value);
  }



  // Add House Function
  const addHouse = async () => {
    try {
      const response = await axios.post(
        `https://${host}/api/houses/add`,
        { 
          house_name: newHouseName,
          address: address,
          password: housePassword,
          confirmPassword : confirmHousePassword,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      
      setNewHouseName('');
      setAddress('');
      setHousePassword('');
      setConfirmHousePassword('');
      setNewHouseModal(false);
      fetchHouseList();
      toast.success('House Added!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('House not added!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  // MANAGE House
  const [manageHouseModal, setManageHouseModal] = useState(false);
  const [deleteHouseModal, setDeleteHouseModal] = useState(false);
  const [editHouseModal, setEditHouseModal] = useState(false);
  const [confirmPasswordHouse, setConfirmPasswordHouse] = useState('');
  const [currentHouseManageId, setCurrentHouseManageId] = useState('');

  const manageHouse = async (index) => {
    setManageHouseModal(true);
    setCurrentHouseManageId(index);
    console.log(currentHouseManageId);
  }

  const handleHideManageHouseModal = () => {
    setManageHouseModal(false);
  }

  const handleHideDeleteHouseModal = () => {
    setDeleteHouseModal(false);
  }

  const handleDeleteHouseModal = () => {
    setManageHouseModal(false);
    setDeleteHouseModal(true);
  }
  
  const handleConfirmPasswordHouse = (event) => {
    setConfirmPasswordHouse(event.target.value);
  }

  const deleteHouse = async () => {
    console.log(confirmPasswordHouse);
    console.log(currentHouseManageId);
    try {
      const response = await axios.delete(
        `https://${host}/api/houses/delet`,
        {
          data: {
            password: confirmPasswordHouse,
            id: currentHouseManageId
          },
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );
  
      setCurrentHouseManageId('');
      setConfirmPasswordHouse('');
      fetchHouseList();
      handleHideDeleteHouseModal();
      toast.success('House Deleted!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error('Error deleting device:', error);
      toast.error('House Not Deleted!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  // Edit Device Modal Functions
  const handleEditHouseModal = () => {
    setManageHouseModal(false);
    setEditHouseModal(true);
  }

  const handleHideEditHouseModal = () => {
    setEditHouseModal(false);
  }

  const updateHouse = async (updatedHouseData) => {
    try {
      const response = await axios.put(
        `https://${host}/api/houses/update`,
        updatedHouseData,
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );
  
      console.log('House updated:', response.data);
      setConfirmPasswordHouse('');
      toast.success('House Updated!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
  
    } catch (error) {
      console.error('Error updating house:', error);
      toast.error('House Not Updated!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  
  const handleUpdateHouse = async () => {
    const updatedHouseData = {
      ...(newHouseName && { house_name: newHouseName }),
      ...(address && { address: address }),
      id: currentHouseManageId,
      password: confirmPasswordHouse,
    };
  
    if (Object.keys(updatedHouseData).length === 0) {
      console.error('No fields to update');
      return;
    }
    
    updateHouse(updatedHouseData);
    setCurrentHouseManageId('');
    setNewHouseName('');
    setAddress('');
    setConfirmPasswordHouse('');
    setEditHouseModal(false);
    fetchHouseList();
  };

  // Fetching House List
  const fetchHouseList = async () => {
    try {
      const response = await axios.get(`https://${host}/api/houses/getAll`, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }); 
      setHouseList(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchHouseList();
  }, []);

  //Fetching Logs List
  // Fetching House List


  const fetchLogsList = async () => {
    const today = new Date();

    const day = today.getDate();
    const month = today.getMonth() + 1; // Months are zero-based
    const year = today.getFullYear();

    const formattedDate = `${day}.${month}.${year}`;

    try {
      
      const response = await axios.post(
        `https://${host}/api/logs/getAll`,
        { date: formattedDate }, // Send house_id in the request body
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );
      
      console.log(response.data.logs);
      setLogsList(response.data.logs);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  // DEVICES Manage
  const showDevices = async (room_id, room_name) => {
    try {
      setCurrentRoom(room_name);
      setCurrentRoomId(room_id);
      const response = await axios.post(
        `https://${host}/api/devices/getAll`,
        { room_id: room_id }, // Send house_id in the request body
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );
      setDevicesList(response.data);
      setHouseListShow(false);
      setDevicesListShow(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Adding New Device
  
  const [newDeviceModal, setNewDeviceModal] = useState(false);

  const handleHideNewDeviceModal = () => {
    setNewDeviceModal(false);
  }

  const [newDeviceName, setNewDeviceName] = useState('');

  const handleNewDeviceName = (event) => {
    setNewDeviceName(event.target.value);
  }

  const [newDeviceHost, setNewDeviceHost] = useState('');

  const handleNewDeviceHost = (event) => {
    setNewDeviceHost(event.target.value);
  }

  const [newDevicePort, setNewDevicePort] = useState('');

  const handleNewDevicePort = (event) => {
    setNewDevicePort(event.target.value);
  }

  const [newDeviceType, setNewDeviceType] = useState('door'); // Set the default value to 'door'

  const handleNewDeviceTypeChange = (event) => {
    setNewDeviceType(event.target.value);
  };

  const [newDeviceStatus, setNewDeviceStatus] = useState('');

  const handleNewDeviceStatus = (event) => {
    setNewDeviceStatus(event.target.value);
  }

  // Add Device Function
  const addDevice = async () => {
    try {
      const response = await axios.post(
        `https://${host}/api/devices/add`,
        { 
          device_name: newDeviceName,
          host: newDeviceHost,
          port: newDevicePort,
          type: newDeviceType,
          room_id: currentRoomId,
          house_id: currentHouseId
        },
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      setNewDeviceName('');
      setNewDeviceHost('');
      setNewDevicePort('');
      setNewDeviceType('');
      setNewDeviceModal(false);
      showDevices(currentRoomId, currentRoom);
      toast.success('Device Added!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Device not added!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  // Manage & Delete Device

  const [manageDeviceModal, setManageDeviceModal] = useState(false);
  const [deleteDeviceModal, setDeleteDeviceModal] = useState(false);
  const [editDeviceModal, setEditDeviceModal] = useState(false);
  const [currentDeviceManageId, setCurrentDeviceManageId] = useState('');

  const manageDevice = async (index) => {
    setManageDeviceModal(true);
    setCurrentDeviceManageId(index);
  }

  const deleteDevice = async () => {
    console.log(currentDeviceManageId);
    console.log(currentRoomId);
  
    try {
      const response = await axios.delete(
        `https://${host}/api/devices/delet`,
        {
          data: {
            id: currentDeviceManageId,
            room_id: currentRoomId,
          },
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );
  
      setCurrentDeviceManageId('');
      showDevices(currentRoomId,currentRoom);
      handleHideDeleteDeviceModal();
      setCurrentDoorId('');
      setDoorState('locked');
      console.log('Device deleted:', response.data);
      toast.success('Device Deleted!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error('Error deleting device:', error);
      toast.error('Device not deleted!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  // Manage Device Modal Functions

  const handleHideManageDeviceModal = () => {
    setManageDeviceModal(false);
  }

  // Delete Device Modal Functions

  const handleDeleteDeviceModal = () => {
    setManageDeviceModal(false);
    setDeleteDeviceModal(true);
  }

  const handleHideDeleteDeviceModal = () => {
    setDeleteDeviceModal(false);
  }

  // Edit Device Modal Functions
  const handleEditDeviceModal = () => {
    setManageDeviceModal(false);
    setEditDeviceModal(true);
  }

  const handleHideEditDeviceModal = () => {
    setEditDeviceModal(false);
  }

  const updateDevice = async (deviceId, updatedDeviceData) => {
    try {
      const response = await axios.put(
        `https://${host}/api/devices/update`,
        updatedDeviceData,
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );
  
      console.log('Device updated:', response.data);
      handleHideEditDeviceModal();
      showDevices(currentRoomId,currentRoom);
      setNewDeviceName('');
      setNewDeviceHost('');
      setNewDevicePort('');
      setNewDeviceType('');
      toast.success('Device Updated!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error('Error updating device:', error);
      toast.error('Error updating device!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  
  const handleUpdateDevice = async () => {
    const updatedDeviceData = {
      ...(newDeviceName && { device_name: newDeviceName }),
      ...(newDeviceHost && { host: newDeviceHost }),
      ...(newDevicePort && { port: newDevicePort }),
      ...(newDeviceType && { type: newDeviceType }),
      room_id: currentRoomId,
      house_id: currentHouseId,
      id: currentDeviceManageId
    };
  
    if (Object.keys(updatedDeviceData).length === 2) {  // Only room_id and house_id
      console.error('No fields to update');
      return;
    }
  
    updateDevice(currentDeviceManageId, updatedDeviceData);
    setNewDeviceModal(false);
  };


  // DEVICES LOGIC

  const [doorState, setDoorState] = useState('locked');
  const [currentDoorId, setCurrentDoorId] = useState('');
  const [currentLightId, setCurrentLightId] = useState('');
  const [currentThermostatId, setCurrentThermostatId] = useState('');
  const [currentThermostatTemperature, setCurrentThermostatTemperature] = useState();
  const [newThermostatTemperature, setNewThermostatTemperature] = useState();
  const [currentTempState, setCurrentTempState] = useState('');

  const setCurrentDeviceId = (index, type) => {
      if (type === "door") {
          setCurrentDoorId(index);
          setCurrentLightId('');
          setCurrentThermostatId('');
          setCurrentThermostatTemperature();
          setCurrentTempState('');
      } else if (type === "light") {
          setCurrentLightId(index);
          setCurrentThermostatId('');
          setCurrentDoorId('');
          setCurrentThermostatTemperature();
          setCurrentTempState('');
      } else if (type === "thermostat") {
          setCurrentThermostatId(index);
          setCurrentLightId('');
          setCurrentDoorId('');
          checkCurrentTemp();
          setCurrentTempState('');
      }
      console.log(type);
      console.log(index);
  };


  const handleUnlockDoor = async () => {
    try {
      const response = await axios.post(
        `https://${host}/api/devices/sendMessage`,
        { 
          device_id : currentDoorId,
          message: "unlock"
        },
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      if(response.status === 200) {
        toast.success('Door Unlocked!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setDoorState('unlocked');
      }
      else {
        toast.error('Door NOT Unlocked!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

    } catch (error) {
      console.error("Something went wrong");
    }
  }

  const handleLockDoor = async () => {
    try {
      const response = await axios.post(
        `https://${host}/api/devices/sendMessage`,
        { 
          device_id : currentDoorId,
          message: "lock"
        },
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      if(response.status === 200) {
        toast.success('Door Locked!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setDoorState('locked');
      }
      else {
        toast.error('Door NOT Locked!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

    } catch (error) {
      console.error("Something went wrong");
    }
  }

  const handleChangeLightColor = async (event, color) => {


    try {
      const response = await axios.post(
        `https://${host}/api/devices/sendMessage`,
        { 
          device_id : currentLightId,
          message: color
        },
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      const elements = document.querySelectorAll('.light-color');
      elements.forEach(element => element.classList.remove('selected-color'));

      // Get the clicked element and add the "selected-color" class to it
      const clickedElement = event.target;
      clickedElement.classList.add('selected-color');

      if(response.status === 200) {
        toast.success('Light Changed!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setDoorState('locked');
      }
      else {
        toast.error('Light NOT Changed', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

    } catch (error) {
      console.error("Something went wrong");
    }
  }


  const checkCurrentTemp = async () => {
    try {
      const response = await axios.post(
        `https://${host}/api/devices/sendMessage`,
        { 
          device_id : currentThermostatId,
          message: "read"
        },
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );
      
      setCurrentThermostatTemperature(response.data.response);

    } catch (error) {
      console.error("Something went wrong");
    }
  }

  const handleNewTemperature = (event) => {
    setNewThermostatTemperature(event.target.value);
  }

  const handleUpdateThermostatTemperature = async () => {
    

    try {

      const response = await axios.post(
        `https://${host}/api/devices/sendMessage`,
        { 
          device_id : currentThermostatId,
          message: newThermostatTemperature < currentThermostatTemperature ? "cool" : "heat"
        },
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      setCurrentTempState(newThermostatTemperature < currentThermostatTemperature ? "cool" : "heat");
      setCurrentThermostatTemperature(response.response);

      setTimeout(() => {
          setCurrentTempState('');
      }, 3000);

    } catch (error) {
      console.error("Something went wrong");
    }
  }


  // TURN OFF DEVICES

  const turnOffDoor = async () => {
    try {
      const response = await axios.post(
        `https://${host}/api/devices/sendMessage`,
        { 
          device_id : currentDoorId,
          message: "doorOff"
        },
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      console.log(response);

    } catch (error) {
      console.error("Something went wrong");
    }
  }

  const turnOffLight = async () => {
    try {
      const response = await axios.post(
        `https://${host}/api/devices/sendMessage`,
        { 
          device_id : currentLightId,
          message: "lightOff"
        },
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      console.log(response);

    } catch (error) {
      console.error("Something went wrong");
    }
  }

  const turnOffThermostat = async () => {
    try {
      const response = await axios.post(
        `https://${host}/api/devices/sendMessage`,
        { 
          device_id : currentThermostatId,
          message: "tempOff"
        },
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      console.log(response);

    } catch (error) {
      console.error("Something went wrong");
    }
  }



  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="light"
        />
      <ToastContainer />
      <Modal onClose={handleHideNewHouseModal} title="Add new house" isOpen={newHouseModal}>
        <div className='flex flex-col gap-[28px]'>
          <Input 
            type="text"
            label="House Name"
            value={newHouseName}
            onChange={handleNewHouseName}
          />
          <Input 
            type="text"
            label="Address"
            value={address}
            onChange={handleHouseAddress}
          />
          <Input 
            type="password"
            label="Your Password"
            value={housePassword}
            onChange={handleHousePassword}
          />
          <Input 
            type="password"
            label="Confirm Your Password"
            value={confirmHousePassword}
            onChange={handleConfirmHousePassword}
          />
          <Button
            label="Submit"
            type="primary"
            additionalClass="w-full"
            onClick={addHouse}
          />
        </div>
      </Modal>
      <Modal onClose={handleHideNewRoomModal} title="Add new room" isOpen={newRoomModal}>
        <div className='flex flex-col gap-[28px]'>
          <Input 
            type="text"
            label="Room Name"
            value={newRoomName}
            onChange={handleNewRoomName}
          />
          <Input 
            type="text"
            label="Floor"
            value={floor}
            onChange={handleRoomFloor}
          />
          <Input 
            type="text"
            label="Room Type"
            value={roomType}
            onChange={handleRoomType}
          />
          <Button
            label="Submit"
            type="primary"
            additionalClass="w-full"
            onClick={addRoom}
          />
        </div>
      </Modal>
      <Modal onClose={handleHideNewDeviceModal} title="Add new device" isOpen={newDeviceModal}>
        <div className='flex flex-col gap-[28px]'>
          <Input 
            type="text"
            label="Device nam"
            value={newDeviceName}
            onChange={handleNewDeviceName}
          />
          <Input 
            type="text"
            label="Host"
            value={newDeviceHost}
            onChange={handleNewDeviceHost}
          />
          <Input 
            type="text"
            label="Port"
            value={newDevicePort}
            onChange={handleNewDevicePort}
          />
          <div className='flex flex-col gap-[12px]'>
            <label htmlFor="deviceType">Type</label>
            <select
              id="deviceType"
              value={newDeviceType}
              onChange={handleNewDeviceTypeChange}
            >
              <option value="door">Door</option>
              <option value="light">Light</option>
              <option value="thermostat">Thermostat</option>
            </select>
          </div>
          <Button
            label="Submit"
            type="primary"
            additionalClass="w-full"
            onClick={addDevice}
          />
        </div>
      </Modal>


      <Modal onClose={handleHideManageHouseModal} title="Manage House" isOpen={manageHouseModal}>
        <div className='grid grid-cols-2 w-full h-[120px] gap-[28px]'>
          <div onClick={handleEditHouseModal} className='bg-[#171717] rounded-[20px] flex items-center justify-center flex-grow cursor-pointer'>
            <p className='text-white font-bold text-[22px]'>EDIT</p>
          </div>
          <div onClick={handleDeleteHouseModal} className='bg-red-500 rounded-[20px] flex items-center justify-center flex-grow cursor-pointer'>
            <p className='text-white font-bold text-[22px]'>DELETE</p>
          </div>
        </div>
      </Modal>
      <Modal onClose={handleHideDeleteHouseModal} title="Enter password to if you are sure" isOpen={deleteHouseModal}>
        <Input 
          type="text"
          label="Confirm Password"
          value={confirmPasswordHouse}
          onChange={handleConfirmPasswordHouse}
        />
        <div className='grid grid-cols-2 w-full h-[120px] gap-[28px]'>
          <div onClick={deleteHouse} className='bg-[#171717] rounded-[20px] flex items-center justify-center flex-grow cursor-pointer'>
            <p className='text-white font-bold text-[22px]'>SUBMIT</p>
          </div>
          <div onClick={() => setDeleteHouseModal(false)} className='bg-red-500 cursor-pointer rounded-[20px] flex items-center justify-center flex-grow'>
            <p className='text-white font-bold text-[22px]'>CANCEL</p>
          </div>
        </div>
      </Modal>
      <Modal onClose={handleHideEditHouseModal} title="Are you sure" isOpen={editHouseModal}>
      <div className='flex flex-col gap-[28px]'>
      <Input 
          type="text"
          label="House Name"
          value={newHouseName}
          onChange={handleNewHouseName}
        />
        <Input 
          type="text"
          label="Address"
          value={address}
          onChange={handleHouseAddress}
        />
        <Input 
          type="password"
          label="Current house password"
          value={confirmPasswordHouse}
          onChange={handleConfirmPasswordHouse}
        />
        <Button
          label="Submit"
          type="primary"
          additionalClass="w-full"
          onClick={handleUpdateHouse}
        />
        </div>
      </Modal>

    
      <Modal onClose={handleHideManageDeviceModal} title="Manage Device" isOpen={manageDeviceModal}>
        <div className='grid grid-cols-2 w-full h-[120px] gap-[28px]'>
          <div onClick={handleEditDeviceModal} className='bg-[#171717] rounded-[20px] flex items-center justify-center flex-grow cursor-pointer'>
            <p className='text-white font-bold text-[22px]'>EDIT</p>
          </div>
          <div onClick={handleDeleteDeviceModal} className='bg-red-500 rounded-[20px] flex items-center justify-center flex-grow cursor-pointer'>
            <p className='text-white font-bold text-[22px]'>DELETE</p>
          </div>
        </div>
      </Modal>
      <Modal onClose={handleHideDeleteDeviceModal} title="Are you sure" isOpen={deleteDeviceModal}>
        <div className='grid grid-cols-2 w-full h-[120px] gap-[28px]'>
          <div onClick={deleteDevice} className='bg-[#171717] rounded-[20px] flex items-center justify-center flex-grow cursor-pointer'>
            <p className='text-white font-bold text-[22px]'>SUBMIT</p>
          </div>
          <div onClick={() => setDeleteDeviceModal(false)} className='bg-red-500 cursor-pointer rounded-[20px] flex items-center justify-center flex-grow'>
            <p className='text-white font-bold text-[22px]'>CANCEL</p>
          </div>
        </div>
      </Modal>
      <Modal onClose={handleHideEditDeviceModal} title="Are you sure" isOpen={editDeviceModal}>
      <div className='flex flex-col gap-[28px]'>
          <Input 
            type="text"
            label="Device nam"
            value={newDeviceName}
            onChange={handleNewDeviceName}
          />
          <Input 
            type="text"
            label="Host"
            value={newDeviceHost}
            onChange={handleNewDeviceHost}
          />
          <Input 
            type="text"
            label="Port"
            value={newDevicePort}
            onChange={handleNewDevicePort}
          />
          <div className='flex flex-col gap-[12px]'>
            <label htmlFor="deviceType">Type</label>
            <select
              id="deviceType"
              value={newDeviceType}
              onChange={handleNewDeviceTypeChange}
            >
              <option value="door">Door</option>
              <option value="light">Light</option>
              <option value="thermostat">Thermostat</option>
            </select>
          </div>
          <Button
            label="Submit"
            type="primary"
            additionalClass="w-full"
            onClick={handleUpdateDevice}
          />
        </div>
      </Modal>

      <Modal onClose={handleHideManageRoomModal} title="Manage Room" isOpen={manageRoomModal}>
        <div className='grid grid-cols-2 w-full h-[120px] gap-[28px]'>
          <div onClick={handleEditRoomModal} className='bg-[#171717] rounded-[20px] flex items-center justify-center flex-grow cursor-pointer'>
            <p className='text-white font-bold text-[22px]'>EDIT</p>
          </div>
          <div onClick={handleDeleteRoomModal} className='bg-red-500 rounded-[20px] flex items-center justify-center flex-grow cursor-pointer'>
            <p className='text-white font-bold text-[22px]'>DELETE</p>
          </div>
        </div>
      </Modal>
      <Modal onClose={handleHideDeleteRoomModal} title="Are you sure" isOpen={deleteRoomModal}>
        <div className='grid grid-cols-2 w-full h-[120px] gap-[28px]'>
          <div onClick={deleteRoom} className='bg-[#171717] rounded-[20px] flex items-center justify-center flex-grow cursor-pointer'>
            <p className='text-white font-bold text-[22px]'>SUBMIT</p>
          </div>
          <div onClick={() => setDeleteRoomModal(false)} className='bg-red-500 cursor-pointer rounded-[20px] flex items-center justify-center flex-grow'>
            <p className='text-white font-bold text-[22px]'>CANCEL</p>
          </div>
        </div>
      </Modal>
      <Modal onClose={handleHideEditRoomModal} title="Are you sure" isOpen={editRoomModal}>
      <div className='flex flex-col gap-[28px]'>
      <div className='flex flex-col gap-[28px]'>
          <Input 
            type="text"
            label="Room Name"
            value={newRoomName}
            onChange={handleNewRoomName}
          />
          <Input 
            type="text"
            label="Floor"
            value={floor}
            onChange={handleRoomFloor}
          />
          <Input 
            type="text"
            label="Room Type"
            value={roomType}
            onChange={handleRoomType}
          />
          <Button
            label="Submit"
            type="primary"
            additionalClass="w-full"
            onClick={handleUpdateRoom}
          />
        </div>
        </div>
      </Modal>

      <div className='p-[20px] bg-[#171717] min-h-[100dvh]'>
        <Navbar
          getLogs={handleLogsListShow}
          getHouse={handleHouseListShow}
          isHouseActive={houseListShow}
          isLogsActive={logsListShow}
        />
        {/* HOUSE and ROOMS LIST */}
        <div className='content w-full h-[calc(100vh-149.6px)]'>
          <div id="houselist" className={`mt-[20px] h-full w-full gap-[20px] overflow-hidden ${houseListShow ? 'flex' : 'hidden'}`}>
            <div className='rounded-[24px] h-full w-1/2 bg-[#202020] p-[32px] overflow-y-scroll'>
              <h2 className='text-[36px] font-semibold text-white'>House List</h2>
              <p className='text-[#B2B2B2] text-[16px]'>Full list of your houses</p>
              <div className='mt-[60px] flex flex-col gap-[20px]'>
                {houseList.map((house, index)=>(
                  <div key={index} onClick={() => showRooms(house?._id, house?.house_name)} className='house'>
                    <h4 className='text-[18px] font-semibold text-white ml-[14px]'>{house?.house_name}</h4>
                    <div onClick={(event) => {event.stopPropagation(); manageHouse(house?._id);}} className='cursor-pointer flex items-center rounded-[16px] border-solid border-[1px] border-[#505050] p-[16px_32px] gap-[10px] hover:bg-[#505050]'>
                      <span className='text-white text-[16px]'>Manage</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14.784" height="16" viewBox="0 0 14.784 16">
                        <path id="Vector" d="M7.385-.036h.933A1.739,1.739,0,0,1,9.946,1.082l.41,1.06,1.287.74,1.13-.172h.01a1.749,1.749,0,0,1,1.749.857l.454.8a1.76,1.76,0,0,1-.141,1.972l-.7.888V8.7l.716.889a1.761,1.761,0,0,1,.144,1.975l-.452.792a1.749,1.749,0,0,1-1.751.86h-.01l-1.13-.172-1.287.74-.41,1.06a1.738,1.738,0,0,1-1.627,1.118H7.385a1.739,1.739,0,0,1-1.628-1.118l-.41-1.06-1.287-.74-1.13.172H2.92a1.749,1.749,0,0,1-1.749-.857l-.454-.8A1.76,1.76,0,0,1,.858,9.6l.7-.888V7.225L.841,6.336A1.761,1.761,0,0,1,.7,4.361l.452-.792A1.749,1.749,0,0,1,2.9,2.709h.01l1.132.172,1.306-.741.41-1.059A1.738,1.738,0,0,1,7.385-.036Zm4.139,4.168a.612.612,0,0,1-.305-.082L9.559,3.1a.612.612,0,0,1-.266-.31L8.8,1.524a.522.522,0,0,0-.488-.336H7.388a.522.522,0,0,0-.488.336L6.423,2.756a.61.61,0,0,1-.279.341l-1.682.955a.612.612,0,0,1-.394.073l-1.335-.2a.529.529,0,0,0-.521.258l-.452.792,0,.007a.528.528,0,0,0,.042.593l.85,1.055a.612.612,0,0,1,.135.384V8.919a.612.612,0,0,1-.131.378l-.832,1.058a.529.529,0,0,0-.044.6l0,.007.454.8a.528.528,0,0,0,.52.254l1.335-.2a.612.612,0,0,1,.4.075l1.66.955a.612.612,0,0,1,.266.31L6.9,14.4a.522.522,0,0,0,.488.336H8.34a.521.521,0,0,0,.487-.336l.488-1.262a.612.612,0,0,1,.266-.31l1.66-.955a.612.612,0,0,1,.4-.075l1.335.2a.529.529,0,0,0,.521-.258l.452-.792,0-.007a.528.528,0,0,0-.042-.593L13.059,9.3a.612.612,0,0,1-.135-.384V7.009a.612.612,0,0,1,.131-.378l.83-1.058a.53.53,0,0,0,.044-.6l0-.007-.454-.8a.529.529,0,0,0-.52-.254l-1.335.2A.612.612,0,0,1,11.523,4.132Zm-3.671.947A2.885,2.885,0,1,1,4.968,7.964,2.888,2.888,0,0,1,7.853,5.079Zm0,4.546A1.661,1.661,0,1,0,6.192,7.964,1.663,1.663,0,0,0,7.853,9.625Z" transform="translate(-0.461 0.036)" fill="#fff"/>
                      </svg>
                    </div>
                  </div>
                ))}
                {houseList.length === 0 && <p className='text-white'>You don't have any houses, try adding one</p>}
                <div onClick={() => setNewHouseModal(true)} className='add-button'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path id="Union" d="M13.688,1.689a1.715,1.715,0,0,0-3.428,0V10.26H1.689a1.715,1.715,0,0,0,0,3.428H10.26v8.571a1.715,1.715,0,1,0,3.428,0V13.688h8.571a1.715,1.715,0,1,0,0-3.428H13.688Z" transform="translate(-0.03 -0.03)" fill="#fff" fillRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className={`rounded-[24px] h-full w-1/2 bg-[#202020] p-[32px] overflow-y-scroll ${currentHouseId==='' ? 'flex items-center justify-center' : ''}`}>
              {currentHouseId === '' ? 
                (
                  <div className='text-white text-[36px] font-bold'>Select house to display rooms</div>
                ):(
                  <>
                  <div className='flex flex-wrap items-center gap-[12px]'>
                    <h2 className='text-[36px] font-semibold text-white'>Room List</h2>
                    <span className='text-[12px] uppercase rounded-full p-[6px_12px] text-black bg-[#A6F26B] font-bold block w-fit'>{currentHouse}</span>
                  </div>
                  <p className='text-[#B2B2B2] text-[16px]'>Full list of your rooms</p>
                  <div className='mt-[60px] flex flex-col gap-[20px]'>
                    {roomList.map((room,index)=>(
                      <div onClick={() => showDevices(room?._id, room?.room_name)} key={index} className='rooms'>
                        <h4 className='text-[18px] font-semibold text-white ml-[14px]'>{room?.room_name}</h4>
                        <div onClick={(event) => {event.stopPropagation(); manageRoom(room?._id);}} className='cursor-pointer flex items-center rounded-[16px] border-solid border-[1px] border-[#505050] p-[16px_32px] gap-[10px] hover:bg-[#505050]'>
                          <span className='text-white text-[16px]'>Manage</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14.784" height="16" viewBox="0 0 14.784 16">
                            <path id="Vector" d="M7.385-.036h.933A1.739,1.739,0,0,1,9.946,1.082l.41,1.06,1.287.74,1.13-.172h.01a1.749,1.749,0,0,1,1.749.857l.454.8a1.76,1.76,0,0,1-.141,1.972l-.7.888V8.7l.716.889a1.761,1.761,0,0,1,.144,1.975l-.452.792a1.749,1.749,0,0,1-1.751.86h-.01l-1.13-.172-1.287.74-.41,1.06a1.738,1.738,0,0,1-1.627,1.118H7.385a1.739,1.739,0,0,1-1.628-1.118l-.41-1.06-1.287-.74-1.13.172H2.92a1.749,1.749,0,0,1-1.749-.857l-.454-.8A1.76,1.76,0,0,1,.858,9.6l.7-.888V7.225L.841,6.336A1.761,1.761,0,0,1,.7,4.361l.452-.792A1.749,1.749,0,0,1,2.9,2.709h.01l1.132.172,1.306-.741.41-1.059A1.738,1.738,0,0,1,7.385-.036Zm4.139,4.168a.612.612,0,0,1-.305-.082L9.559,3.1a.612.612,0,0,1-.266-.31L8.8,1.524a.522.522,0,0,0-.488-.336H7.388a.522.522,0,0,0-.488.336L6.423,2.756a.61.61,0,0,1-.279.341l-1.682.955a.612.612,0,0,1-.394.073l-1.335-.2a.529.529,0,0,0-.521.258l-.452.792,0,.007a.528.528,0,0,0,.042.593l.85,1.055a.612.612,0,0,1,.135.384V8.919a.612.612,0,0,1-.131.378l-.832,1.058a.529.529,0,0,0-.044.6l0,.007.454.8a.528.528,0,0,0,.52.254l1.335-.2a.612.612,0,0,1,.4.075l1.66.955a.612.612,0,0,1,.266.31L6.9,14.4a.522.522,0,0,0,.488.336H8.34a.521.521,0,0,0,.487-.336l.488-1.262a.612.612,0,0,1,.266-.31l1.66-.955a.612.612,0,0,1,.4-.075l1.335.2a.529.529,0,0,0,.521-.258l.452-.792,0-.007a.528.528,0,0,0-.042-.593L13.059,9.3a.612.612,0,0,1-.135-.384V7.009a.612.612,0,0,1,.131-.378l.83-1.058a.53.53,0,0,0,.044-.6l0-.007-.454-.8a.529.529,0,0,0-.52-.254l-1.335.2A.612.612,0,0,1,11.523,4.132Zm-3.671.947A2.885,2.885,0,1,1,4.968,7.964,2.888,2.888,0,0,1,7.853,5.079Zm0,4.546A1.661,1.661,0,1,0,6.192,7.964,1.663,1.663,0,0,0,7.853,9.625Z" transform="translate(-0.461 0.036)" fill="#fff"/>
                          </svg>
                        </div>
                      </div>
                    ))}
                    {roomList.length === 0 && <p className='text-white'>You don't have any rooms for this, try adding one</p>}
                    <div onClick={() => setNewRoomModal(true)} className='add-button'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path id="Union" d="M13.688,1.689a1.715,1.715,0,0,0-3.428,0V10.26H1.689a1.715,1.715,0,0,0,0,3.428H10.26v8.571a1.715,1.715,0,1,0,3.428,0V13.688h8.571a1.715,1.715,0,1,0,0-3.428H13.688Z" transform="translate(-0.03 -0.03)" fill="#fff" fillRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  </>
                )}
            </div>
          </div>
          <div id="deviceslist" className={`mt-[20px] h-full w-full gap-[20px] overflow-hidden ${devicesListShow ? 'flex' : 'hidden'}`}>
            <div className='rounded-[24px] h-full w-1/2 bg-[#202020] p-[32px] overflow-y-scroll'>
              <div className='flex flex-wrap items-center gap-[12px]'>
                <h2 className='text-[36px] font-semibold text-white'>Devices List</h2>
                <span className='text-[12px] uppercase rounded-full p-[6px_12px] text-black bg-[#A6F26B] font-bold block w-fit'>{currentRoom}</span>
              </div>
              <p className='text-[#B2B2B2] text-[16px]'>Full list of your devices</p>
              <div className='mt-[60px] flex flex-col gap-[20px]'>
                {devicesList.map((device, index)=>(
                  <div onClick={() => setCurrentDeviceId(device?._id, device?.type)} key={index} className='device'>
                    <div className='flex items-center gap-[20px]'>
                      <div className='w-[54px] h-[54px] rounded-[16px] bg-[#505050] flex items-center justify-center'>
                        {device?.type==="door" && 
                        <svg xmlns="http://www.w3.org/2000/svg" width="13.662" height="20.706" viewBox="0 0 13.662 20.706">
                          <g id="Open_Door" data-name="Open Door" transform="translate(-184.65 -48.383)">
                            <g id="Group_68" data-name="Group 68" transform="translate(189.051 59.109)">
                              <g id="Group_67" data-name="Group 67" transform="translate(0 0)">
                                <path id="Path_27" data-name="Path 27" d="M259.142,232.1h-1.193a.348.348,0,1,0,0,.7h1.193a.348.348,0,0,0,0-.7Z" transform="translate(-257.6 -232.1)" fill="#fff"/>
                                <path id="Path_27_-_Outline" data-name="Path 27 - Outline" d="M257.948,231.85h1.193a.6.6,0,0,1,0,1.2h-1.193a.6.6,0,1,1,0-1.2Zm1.193.7a.1.1,0,0,0,0-.2h-1.193a.1.1,0,0,0,0,.2Z" transform="translate(-257.6 -232.1)" fill="#fff"/>
                              </g>
                            </g>
                            <g id="Group_70" data-name="Group 70" transform="translate(184.9 48.633)">
                              <g id="Group_69" data-name="Group 69" transform="translate(0 0)">
                                <path id="Path_28" data-name="Path 28" d="M197.714,49.642h-5.145v-.662a.341.341,0,0,0-.137-.274.36.36,0,0,0-.3-.063L185.157,50.5a.343.343,0,0,0-.257.337v1.131a.348.348,0,1,0,.7,0v-.857l6.275-1.673V68.068L185.6,66.812V53.136a.348.348,0,1,0-.7,0V67.1a.354.354,0,0,0,.28.343l6.972,1.393a.278.278,0,0,0,.069.006.347.347,0,0,0,.348-.348v-.662h3.215a.348.348,0,0,0,0-.7h-3.215v-.994h3.455a.346.346,0,0,0,.348-.348V51.68a.346.346,0,0,0-.348-.348h-3.455v-.994h4.8V67.132h-.5a.348.348,0,0,0,0,.7h.845a.346.346,0,0,0,.348-.348V49.99A.35.35,0,0,0,197.714,49.642Zm-2.044,2.393V65.442h-3.1V52.034Z" transform="translate(-184.9 -48.633)" fill="#fff"/>
                                <path id="Path_28_-_Outline" data-name="Path 28 - Outline" d="M192.215,48.383h0a.6.6,0,0,1,.368.124.591.591,0,0,1,.235.473v.412h4.895a.6.6,0,0,1,.6.6V67.48a.6.6,0,0,1-.6.6h-.845a.6.6,0,0,0-1.085,0h-2.965v.412a.6.6,0,0,1-.213.458l0,0a.6.6,0,0,1-.381.136.521.521,0,0,1-.122-.011l-6.968-1.392a.606.606,0,0,1-.481-.588V53.136a.6.6,0,0,1,.474-.585.6.6,0,0,1-.474-.585V50.835a.6.6,0,0,1,.444-.579l6.981-1.858A.649.649,0,0,1,192.215,48.383Zm5.5,19.2a.1.1,0,0,0,.1-.1V49.99a.1.1,0,0,0-.1-.1h-5.395v-.912a.091.091,0,0,0-.035-.072l-.008-.006a.1.1,0,0,0-.06-.018l-.028,0-6.966,1.854a.093.093,0,0,0-.071.1v1.131a.1.1,0,1,0,.2,0V50.917l6.775-1.806V68.373l-6.775-1.356V53.136a.1.1,0,1,0-.2,0V67.1a.1.1,0,0,0,.082.1l6.973,1.393h.016a.105.105,0,0,0,.062-.022.1.1,0,0,0,.036-.077v-.912h3.465a.1.1,0,0,0,0-.2h-3.465V65.888h3.7a.1.1,0,0,0,.1-.1V51.68a.1.1,0,0,0-.1-.1h-3.7V50.088h5.3V67.382h-.747a.1.1,0,0,0,0,.2Zm-6.091.185v-18l-5.775,1.54v.664a.6.6,0,0,1-.474.585.6.6,0,0,1,.474.585V66.607Zm5.493-17.175h-4.3v.494h3.2a.6.6,0,0,1,.6.6V65.79a.6.6,0,0,1-.6.6h-3.2v.494h2.965a.6.6,0,0,0,1.085,0h.247Zm-4.8,1.2h3.6V65.692h-3.6Zm3.1.5h-2.6V65.192h2.6Z" transform="translate(-184.9 -48.633)" fill="#fff"/>
                              </g>
                            </g>
                          </g>
                        </svg>
                        }
                        {device?.type==="light" && 
                        <svg xmlns="http://www.w3.org/2000/svg" width="17.179" height="24" viewBox="0 0 17.179 24">
                          <g id="lightbulb--lighting-light-incandescent-bulb-lights" transform="translate(-1.821 0.037)">
                            <path id="Vector" d="M10.405-.037A8.591,8.591,0,0,1,19,8.615q0,.03,0,.059a8.5,8.5,0,0,1-4.26,7.3v2.008a1.772,1.772,0,0,1-1.77,1.77H7.853a1.772,1.772,0,0,1-1.77-1.77v-2.01A8.59,8.59,0,0,1,10.405-.037Zm6.759,8.584a6.715,6.715,0,0,0-5.69-6.663,6.81,6.81,0,0,0-1.07-.085,6.754,6.754,0,0,0-3,12.805.918.918,0,0,1,.51.822v2.491H12.9V15.426a.918.918,0,0,1,.512-.823,6.681,6.681,0,0,0,3.749-6Q17.163,8.575,17.165,8.546Z" fill="#fff"/>
                            <path id="Vector_2" d="M11.879,13.872H5.061a.918.918,0,0,1,0-1.836h6.818a.918.918,0,0,1,0,1.836Z" transform="translate(1.941 10.091)" fill="#fff"/>
                          </g>
                        </svg>
                        }
                        {device?.type==="thermostat" && 
                          <svg xmlns="http://www.w3.org/2000/svg" width="10.362" height="24" viewBox="0 0 10.362 24">
                            <g id="thermometer--temperature-thermometer-weather-level-meter-mercury-measure" transform="translate(-138.678 113.036)">
                              <path id="Vector" d="M8.859,23.964a5.18,5.18,0,0,1-3.476-9.021V3.44a3.476,3.476,0,1,1,6.952,0v11.5a5.18,5.18,0,0,1-3.476,9.021Zm0-22.164A1.642,1.642,0,0,0,7.22,3.44V15.375a.918.918,0,0,1-.367.734,3.344,3.344,0,1,0,4.014,0,.918.918,0,0,1-.367-.734V3.44A1.642,1.642,0,0,0,8.859,1.8Z" transform="translate(135 -113)" fill="#fff"/>
                            </g>
                          </svg>
                        }
                      </div>
                      <h4 className='text-[18px] font-semibold text-white ml-[14px]'>{device?.device_name}</h4>
                    </div>
                    <div onClick={(event) => {event.stopPropagation(); manageDevice(device?._id);}} className='cursor-pointer flex items-center rounded-[16px] border-solid border-[1px] border-[#505050] p-[16px_32px] gap-[10px] hover:bg-[#505050]'>
                      <span className='text-white text-[16px]'>Manage</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14.784" height="16" viewBox="0 0 14.784 16">
                        <path id="Vector" d="M7.385-.036h.933A1.739,1.739,0,0,1,9.946,1.082l.41,1.06,1.287.74,1.13-.172h.01a1.749,1.749,0,0,1,1.749.857l.454.8a1.76,1.76,0,0,1-.141,1.972l-.7.888V8.7l.716.889a1.761,1.761,0,0,1,.144,1.975l-.452.792a1.749,1.749,0,0,1-1.751.86h-.01l-1.13-.172-1.287.74-.41,1.06a1.738,1.738,0,0,1-1.627,1.118H7.385a1.739,1.739,0,0,1-1.628-1.118l-.41-1.06-1.287-.74-1.13.172H2.92a1.749,1.749,0,0,1-1.749-.857l-.454-.8A1.76,1.76,0,0,1,.858,9.6l.7-.888V7.225L.841,6.336A1.761,1.761,0,0,1,.7,4.361l.452-.792A1.749,1.749,0,0,1,2.9,2.709h.01l1.132.172,1.306-.741.41-1.059A1.738,1.738,0,0,1,7.385-.036Zm4.139,4.168a.612.612,0,0,1-.305-.082L9.559,3.1a.612.612,0,0,1-.266-.31L8.8,1.524a.522.522,0,0,0-.488-.336H7.388a.522.522,0,0,0-.488.336L6.423,2.756a.61.61,0,0,1-.279.341l-1.682.955a.612.612,0,0,1-.394.073l-1.335-.2a.529.529,0,0,0-.521.258l-.452.792,0,.007a.528.528,0,0,0,.042.593l.85,1.055a.612.612,0,0,1,.135.384V8.919a.612.612,0,0,1-.131.378l-.832,1.058a.529.529,0,0,0-.044.6l0,.007.454.8a.528.528,0,0,0,.52.254l1.335-.2a.612.612,0,0,1,.4.075l1.66.955a.612.612,0,0,1,.266.31L6.9,14.4a.522.522,0,0,0,.488.336H8.34a.521.521,0,0,0,.487-.336l.488-1.262a.612.612,0,0,1,.266-.31l1.66-.955a.612.612,0,0,1,.4-.075l1.335.2a.529.529,0,0,0,.521-.258l.452-.792,0-.007a.528.528,0,0,0-.042-.593L13.059,9.3a.612.612,0,0,1-.135-.384V7.009a.612.612,0,0,1,.131-.378l.83-1.058a.53.53,0,0,0,.044-.6l0-.007-.454-.8a.529.529,0,0,0-.52-.254l-1.335.2A.612.612,0,0,1,11.523,4.132Zm-3.671.947A2.885,2.885,0,1,1,4.968,7.964,2.888,2.888,0,0,1,7.853,5.079Zm0,4.546A1.661,1.661,0,1,0,6.192,7.964,1.663,1.663,0,0,0,7.853,9.625Z" transform="translate(-0.461 0.036)" fill="#fff"/>
                      </svg>
                    </div>
                  </div>
                ))}
                {devicesList.length === 0 && <p className='text-white'>You don't have any devices for this room, try adding one</p>}
                <div onClick={() => setNewDeviceModal(true)} className='add-button'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path id="Union" d="M13.688,1.689a1.715,1.715,0,0,0-3.428,0V10.26H1.689a1.715,1.715,0,0,0,0,3.428H10.26v8.571a1.715,1.715,0,1,0,3.428,0V13.688h8.571a1.715,1.715,0,1,0,0-3.428H13.688Z" transform="translate(-0.03 -0.03)" fill="#fff" fillRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className='rounded-[24px] h-full w-1/2 bg-[#202020] p-[32px] overflow-y-scroll flex items-center justify-center'>
              <div className={`flex-col items-center gap-[20px] ${currentDoorId === '' ? 'hidden' : 'flex'}`}>
                <div className={`w-[90px] h-[90px] flex items-center justify-center rounded-[10px] ${doorState === "unlocked" ? 'bg-[#A6F26B]' : 'bg-[#505050]'}`}>
                  {doorState === "unlocked" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="45.125" height="45.125" viewBox="0 0 45.125 45.125">
                      <g id="lock-unlock" transform="translate(-0.438 -0.438)">
                        <path id="Path_32" data-name="Path 32" d="M21.563,19.688a1,1,0,0,1-1-1V11.5a9.063,9.063,0,0,0-18.125,0v7.188a1,1,0,0,1-2,0V11.5A11.063,11.063,0,0,1,19.322,3.678a10.99,10.99,0,0,1,3.24,7.822v7.188A1,1,0,0,1,21.563,19.688Z" fill="#242424"/>
                        <path id="Path_33" data-name="Path 33" d="M41.688,45.563H15.813a4.565,4.565,0,0,1-1.885-.465,3.6,3.6,0,0,1-1.99-3.41V21.563a4.565,4.565,0,0,1,.465-1.885,3.6,3.6,0,0,1,3.41-1.99H41.688a4.565,4.565,0,0,1,1.885.465,3.6,3.6,0,0,1,1.99,3.41V41.688a4.565,4.565,0,0,1-.465,1.885A3.6,3.6,0,0,1,41.688,45.563ZM15.813,19.688a1.615,1.615,0,0,0-1.621.885,2.644,2.644,0,0,0-.254.99V41.688a1.615,1.615,0,0,0,.885,1.621,2.644,2.644,0,0,0,.99.254H41.688a1.615,1.615,0,0,0,1.621-.885,2.644,2.644,0,0,0,.254-.99V21.563a1.615,1.615,0,0,0-.885-1.621,2.644,2.644,0,0,0-.99-.254Z" fill="#242424"/>
                        <path id="Path_34" data-name="Path 34" d="M28.75,35.5a1,1,0,0,1-1-1V28.75a1,1,0,0,1,2,0V34.5A1,1,0,0,1,28.75,35.5Z" fill="#242424"/>
                      </g>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="33.625" height="45.125" viewBox="0 0 33.625 45.125">
                      <g id="lock-1" transform="translate(-6.188 -0.438)">
                        <path id="Path_29" data-name="Path 29" d="M35.938,45.563H10.063A4.565,4.565,0,0,1,8.178,45.1a3.6,3.6,0,0,1-1.99-3.41V21.563a4.565,4.565,0,0,1,.465-1.885,3.6,3.6,0,0,1,3.41-1.99H35.938a4.565,4.565,0,0,1,1.885.465,3.6,3.6,0,0,1,1.99,3.41V41.688a4.565,4.565,0,0,1-.465,1.885A3.6,3.6,0,0,1,35.938,45.563ZM10.063,19.688a1.615,1.615,0,0,0-1.621.885,2.644,2.644,0,0,0-.254.99V41.688a1.615,1.615,0,0,0,.885,1.621,2.644,2.644,0,0,0,.99.254H35.938a1.615,1.615,0,0,0,1.621-.885,2.644,2.644,0,0,0,.254-.99V21.563a1.615,1.615,0,0,0-.885-1.621,2.644,2.644,0,0,0-.99-.254Z" fill="#fff"/>
                        <path id="Path_30" data-name="Path 30" d="M33.063,19.688a1,1,0,0,1-1-1V11.5a9.063,9.063,0,0,0-18.125,0v7.188a1,1,0,0,1-2,0V11.5a11.063,11.063,0,1,1,22.125,0v7.188A1,1,0,0,1,33.063,19.688Z" fill="#fff"/>
                        <path id="Path_31" data-name="Path 31" d="M23,35.5a1,1,0,0,1-1-1V28.75a1,1,0,0,1,2,0V34.5A1,1,0,0,1,23,35.5Z" fill="#fff"/>
                      </g>
                    </svg>
                  )}
                </div>
                <div className='flex gap-[8px]'>
                  <button onClick={handleLockDoor} className='text-[20px] p-[6px_12px] rounded-[10px] bg-[#3A3A3A] text-white hover:bg-[#505050] cursor-pointer' disabled={doorState === "locked"}>Lock</button>
                  <button onClick={handleUnlockDoor} className='text-[20px] p-[6px_12px] rounded-[10px] bg-[#3A3A3A] text-white hover:bg-[#505050] cursor-pointer' disabled={doorState === "unlocked"}>Unlock</button>
                </div>
              </div>
              <div className={`flex-col items-center gap-[20px] ${currentLightId === '' ? 'hidden' : 'flex'}`}>
                <div className='flex gap-[20px]'>
                    <div onClick={(e) => handleChangeLightColor(e, "FF0000")} className='rounded-[10px] w-[90px] aspect-square bg-[#FF0000] light-color selected-color'></div>
                    <div onClick={(e) => handleChangeLightColor(e, "FFFF00")} className='rounded-[10px] w-[90px] aspect-square bg-[#FFFF00] light-color'></div>
                    <div onClick={(e) => handleChangeLightColor(e, "0000FF")} className='rounded-[10px] w-[90px] aspect-square bg-[#0000FF] light-color'></div>
                </div>
              </div>
              <div className={`flex-col items-center gap-[20px] ${currentThermostatId === '' ? 'hidden' : 'flex'}`}>
                <div className='flex flex-col gap-[36px]'>
                  <div className={`justify-center ${currentTempState === '' ? 'hidden' : 'flex'}`}>
                    {currentTempState === "cool" ? (
                      <div className='flex flex-col gap-[12px] items-center tempstate'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="87.505" height="100" viewBox="0 0 87.505 100">
                          <path id="snowflake-solid" d="M43.708,0a6.243,6.243,0,0,1,6.25,6.25v5.879l2.93-2.93a4.682,4.682,0,0,1,6.621,6.621l-9.57,9.57v13.73l11.992-6.992,3.457-12.91a4.69,4.69,0,1,1,9.063,2.422l-1.016,3.77,4.609-2.7a6.254,6.254,0,0,1,6.309,10.8l-4.941,2.891,4.238,1.133A4.69,4.69,0,1,1,81.228,46.6L68.005,43.066,56.111,50l11.895,6.934L81.228,53.4a4.69,4.69,0,1,1,2.422,9.062l-4.238,1.133,4.941,2.891a6.254,6.254,0,0,1-6.309,10.8l-4.609-2.7,1.016,3.77a4.69,4.69,0,1,1-9.062,2.422l-3.457-12.91L49.958,60.879v13.73l9.57,9.57A4.682,4.682,0,0,1,52.907,90.8l-2.93-2.93V93.75a6.25,6.25,0,0,1-12.5,0V87.871l-2.93,2.93a4.682,4.682,0,0,1-6.621-6.621l9.57-9.57V60.879L25.505,67.871l-3.457,12.91a4.69,4.69,0,1,1-9.062-2.422L14,74.59,9.353,77.266a6.254,6.254,0,0,1-6.309-10.8l4.941-2.891L3.747,62.441a4.69,4.69,0,0,1,2.422-9.062l13.223,3.535L31.306,50,19.411,43.066,6.189,46.6a4.69,4.69,0,1,1-2.422-9.062l4.238-1.133L3.064,33.516A6.246,6.246,0,1,1,9.372,22.734l4.609,2.7-1.016-3.77a4.69,4.69,0,0,1,9.062-2.422l3.457,12.91,11.973,6.973V25.371l-9.57-9.551A4.682,4.682,0,0,1,34.509,9.2l2.93,2.93V6.25A6.243,6.243,0,0,1,43.689,0Z" transform="translate(0.052)" fill="#4caffa"/>
                        </svg>
                        <p className='text-white'>Cooling..</p>
                      </div>
                    ):(
                      <div className='flex flex-col gap-[12px] items-center tempstate'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="87.496" height="100" viewBox="0 0 87.496 100">
                          <path id="fire-solid" d="M31.112,1.034a3.956,3.956,0,0,1,5.41.02A157.582,157.582,0,0,1,51.7,17.459a71.217,71.217,0,0,1,7.226-8.378,3.971,3.971,0,0,1,5.468.02,84.86,84.86,0,0,1,16.5,23.046C84.859,40.114,87.5,48.259,87.5,54,87.5,78.921,68,99.975,43.748,99.975,19.218,99.975,0,78.9,0,53.981c0-7.5,3.476-16.659,8.867-25.721A124.928,124.928,0,0,1,31.112,1.034ZM44.08,81.226a23.582,23.582,0,0,0,13.437-4.1C65.739,71.382,67.946,59.9,63,50.876a2.6,2.6,0,0,0-4.394-.391l-4.922,5.722a3.13,3.13,0,0,1-4.824-.1c-3.222-4.1-8.984-11.425-12.265-15.585a3.068,3.068,0,0,0-4.824-.02c-6.6,8.3-9.921,13.534-9.921,19.413C21.874,73.3,31.756,81.226,44.08,81.226Z" transform="translate(0 0.025)" fill="#f04c4c"/>
                        </svg>

                        <p className='text-white'>Heating..</p>
                      </div>
                    )}
                  </div>
                  <div className='flex flex-col items-center'>
                    <p className='text-white'>Current temperature</p>
                    <h3 className='font-bold text-[36px] text-white'>{currentThermostatTemperature}</h3>
                  </div>
                  <div className='flex flex-col gap-[12px] items-center'>
                    <p className='text-white text-[20px] font-semibold text-center'>Enter new temperature</p>
                    <Input 
                      type="number"
                      label=""
                      value={newThermostatTemperature}
                      onChange={handleNewTemperature}
                      additionalClass="text-center"
                    />
                    <Button
                      label="Submit"
                      type="primary"
                      additionalClass="w-full"
                      onClick={handleUpdateThermostatTemperature}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`mt-[20px] h-full w-full gap-[20px] overflow-y-scroll ${logsListShow ? 'flex' : 'hidden'}`}>
          <table className='w-full'>
            <thead>
              <tr>
                <th>Status</th>
                <th>Message</th>
                <th>Additional</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {logsList.map((log, index) => (
                <tr key={index}>
                  <td className='flex items-center gap-[8px]'><div className={`w-[10px] h-[10px] rounded-full ${log?.status===200 ? 'good-status' : 'bad-status'}`}></div>{log?.status}</td>
                  <td>{log?.message}</td>
                  <td>{log?.additional}</td>
                  <td>{log?.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard