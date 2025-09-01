import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { API_URL } from './config';

export default function App() {
  const [huespedes, setHuespedes] = useState([]);
  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setCorreo] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchHuespedes(); }, []);

  const fetchHuespedes = async () => {
    try {
      const res = await axios.get(`${API_URL}/huespedes`);
      setHuespedes(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'No se pudo cargar huéspedes');
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (!dni || !nombre) { Alert.alert('Validación', 'DNI y Nombre requeridos'); return; }
      if (editingId) {
        await axios.put(`${API_URL}/huespedes/${editingId}`, { dni, nombre, email });
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/huespedes`, { dni, nombre, email });
      }
      setDni(''); setNombre(''); setCorreo('');
      fetchHuespedes();
    } catch (err) {
      console.log(err.response?.data || err.message);
      Alert.alert('Error', err.response?.data?.error || 'Error en operación');
    }
  };

  const handleEdit = (item) => {
    setDni(item.dni); setNombre(item.nombre); setEditingId(item._id);
    setCorreo(item.correo);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/huespedes/${id}`);
      fetchHuespedes();
    } catch (err) {
      Alert.alert('Error', 'No se pudo eliminar');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={{flex:1}}>
        <Text style={{fontWeight:'bold'}}>{item.nombre}</Text>
        <Text>{item.dni} · {item.email || '-'}</Text>
      </View>
      <View style={{justifyContent:'center'}}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.btnSmall}><Text>Editar</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item._id)} style={[styles.btnSmall,{marginTop:0, backgroundColor:'#f88'}]}><Text>Eliminar</Text></TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{flex:1, padding:60, backgroundColor:'#fff'}}>
      <Text style={{fontSize:20, fontWeight:'bold', marginBottom:20}}>Huéspedes</Text>
      <FlatList data={huespedes} keyExtractor={i=>i._id} renderItem={renderItem} />

      <View style={{marginTop:0}}>
        <Text style={{fontWeight:'bold'}}>{editingId ? 'Editar huésped' : 'Nuevo huésped'}</Text>
        <TextInput placeholder="DNI" value={dni} onChangeText={setDni} style={styles.input}/>
        <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input}/>
        <TextInput placeholder="Correo" value={email} onChangeText={setCorreo} style={styles.input}/>
        <Button title={editingId ? 'Actualizar' : 'Crear'} onPress={handleCreateOrUpdate} />
        {editingId ? <Button title="Cancelar" color="#666" onPress={() => { setEditingId(null); setDni(''); setNombre(''); setCorreo(''); }} /> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input:{ borderWidth:1, borderColor:'#ccc', padding:10, marginVertical:20, borderRadius:6 },
  item:{ flexDirection:'row', padding:1, borderBottomWidth:1, borderColor:'#eee', alignItems:'center' },
  btnSmall:{ padding:10, marginVertical:50, backgroundColor:'#ddd', borderRadius:6, alignItems:'center' }
});
