import React, { Component,Navigator } from 'react';
import Login from '../Login/Login';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { FormLabel, FormInput,Header,CheckBox, FormValidationMessage } from 'react-native-elements';
import bcrypt from 'react-native-bcrypt';
import Home from '../Home/Home';
import TermsAndConditions from '../TermsAndConditions';



export default class createAccount extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            isBack:false,
            isTandC:false,
            isCreated:false,
            fname: '',
            lname: '',
            email: '',
            username: '',
            pass: '',
            pass2: '',
            ffUser: false,
            tAndC: false,
            emptyFName: '',
            emptyLName:'',
            emailError:'',
            usernameError:'',
            passwordError:'',
            passwordMatchError: '',
    };
 }
toggleFFUSer (checkbok) {

    if (checkbok=='ffUser'){
        this.setState({
        ffUser: !this.state.ffUser
         })
    }else{
        
        this.setState({
        tAndC: !this.state.tAndC
         })
    }
}
checkIfFilled(){
    this.setState({
        emptyFName: '',
        emptyLName:'',
        emailError:'',
        usernameError:'',
        passwordError:'',
        passwordMatchError: '',

    }) 
    var error=true;
    if(this.state.fname==''){
        this.setState({
            emptyFName: 'Please enter your first name.'
        })  
        error=false;    
    }
     if(this.state.lname==''){
        this.setState({
            emptyLName: 'Please enter your last name.'
        })  
        error=false;      
    }
    if(this.state.username==''){
        this.setState({
            usernameError: 'Please enter a username'
        }) 
        error=false;       
    }
    if(this.state.pass==''){
        this.setState({
            passwordError: 'Please enter a password.'
        })  
        error=false;      
    }
    if(this.state.pass2==''){
        this.setState({
            passwordMatchError: 'Please confirm your password.'
        })  
        error=false;      
    }
    return error;
}

checkEmail(){
   // also chech that @ is before .ca .com 
    if (!this.state.email.includes('@')||(!this.state.email.includes('.ca')&&!this.state.email.includes('.com')) ){
        this.setState({
            emailError: 'Please enter a correct email address.'
        }) 
        return false;
    }
    return true;
}
checkPasswords(){
    if (this.state.pass!=this.state.pass2){
        this.setState({
            passwordMatchError: 'Passwords do not match, try again.'
        }) 
        return false;
    }
    return true;
}
checkTandC(){
    return(this.state.tAndC);
}

saveAccount(){

 return fetch('http://acoupleofbytes.jordonsmith.ca/signup/', {
  method: 'POST',
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   },
  body: JSON.stringify({"username": this.state.username, "password": this.state.pass, "firstname":this.state.fname, "lastname": this.state.lname, "email": this.state.email})

 }).then((response) => response.json())
      .then((responseJson) => {

          if (responseJson.error){
                this.setState({usernameError:responseJson.error})
                return 0;
            }else{
                this.setState({isLogin:true})// create session
                this.setState({sessionKey:responseJson})
            } 
        return responseJson;
      })
      .catch((error) => {
          console.log(error);
       // console.error(error);
      });
      
}

submitButton(){
    //check if user name is avaiable
    //check if password is vaild   
    
    // var salt = bcrypt.genSaltSync(10);
    // var hash = bcrypt.hashSync(this.state.pass, salt);
    //console.log(hash);
    if (this.checkIfFilled()&&this.checkEmail()&&this.checkPasswords()&&this.checkTandC()){
        var user={
            firstName:this.state.fname,
            lastname:this.state.lname,
            email:this.state.email,
            username:this.state.username,
            password:this.state.pass,//hash password
            ffUser:this.state.ffUser,  
        }
        // send to back-end
        var test=this.saveAccount();
       
         this.setState({
            isCreated: true,
        })  

   }   
}
goBack(){
     this.setState({
        isBack: true,
    })  
}
goToTandC(){
     this.setState({
        isTandC: true,
    })  
}

  render() {
   
    if(this.state.isBack|| this.state.isCreated) {
        return <Login />
    }
        if(this.state.isTandC){
        return <TermsAndConditions />
    }
    return (
       
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={{height:50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingVertical: 30}}>
                <TouchableOpacity  style={styles.logo2 }onPress={() => this.goBack()}>
                    <Image resizeMode="contain" style={styles.logo2} source={require('../images/back.png')} />
                </TouchableOpacity >
                <Text style= {{color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 20, flex:1}}>Create an Account </Text>
            </View>  
        <View style={styles.container}>
             <ScrollView>
            <View style={styles.form}>
             <FormLabel labelStyle={{color: '#fff'}}>Please enter your person information.</FormLabel>
            <CheckBox
                title='Are you a family or friend of a Comunity Living Cambridge Participant'
                checked={this.state.ffUser}
                onPress={(ffUser) => this.toggleFFUSer('ffUser')}
                containerStyle={styles.CheckBox}
                checkedColor='#21df21'
                textStyle={styles.CheckBoxTextStyle}
                checkedTitle='You are a family or friend of a Comunity Living Cambridge Participant'
            />
 
            
            <FormLabel labelStyle={{color: '#fff'}}>First Name</FormLabel>
            <FormInput 
                placeholder='Enter Your First Name...'  
                placeholderTextColor={'#AAAAAA'} 
                containerStyle={styles.FormInput} 
                inputStyle={{color: '#fff'}} 
                onChangeText={(fname) => this.setState({fname})}/>
             <FormValidationMessage>{this.state.emptyFName}</FormValidationMessage>   
            
            <FormLabel labelStyle={{color: '#fff'}}>Last Name</FormLabel>
            <FormInput 
                placeholder='Enter Your Last Name...'  
                placeholderTextColor={'#AAAAAA'} 
                containerStyle={styles.FormInput} 
                inputStyle={{color: '#fff'}} 
                onChangeText={(lname) => this.setState({lname})}/>
           <FormValidationMessage>{this.state.emptyLName}</FormValidationMessage>

            <FormLabel labelStyle={{color: '#fff'}}>Email Address</FormLabel>
            <FormInput 
                placeholder='Enter Your Email Address...' 
                placeholderTextColor={'#AAAAAA'} 
                containerStyle={styles.FormInput} 
                inputStyle={{color: '#fff'}} 
                onChangeText={(email) => this.setState({email})}/>
            <FormValidationMessage>{this.state.emailError}</FormValidationMessage>


            </View>
            <View style={styles.form}>
            <FormLabel labelStyle={{color: '#fff'}}>Username</FormLabel>
            <FormInput 
                placeholder='Create a Username'   
                placeholderTextColor={'#AAAAAA'}
                containerStyle={styles.FormInput} 
                inputStyle={{color: '#fff'}} 
                onChangeText={(username) => this.setState({username})}/>
            <FormValidationMessage>{this.state.usernameError}</FormValidationMessage>

            <FormLabel labelStyle={{color: '#fff'}}>Password</FormLabel>
            <FormInput 
                placeholder='Enter a Password' 
                secureTextEntry 
                placeholderTextColor={'#AAAAAA'} 
                containerStyle={styles.FormInput} 
                inputStyle={{color: '#fff'}} 
                onChangeText={(pass) => this.setState({pass})}/>
            <FormValidationMessage>{this.state.passwordError}</FormValidationMessage>

            <FormLabel labelStyle={{color: '#fff'}}>Confirm Password</FormLabel>
            <FormInput 
                placeholder='Re-enter the password' 
                secureTextEntry 
                placeholderTextColor={'#AAAAAA'} 
                containerStyle={styles.FormInput} 
                inputStyle={{color: '#fff'}} 
                onChangeText={(pass2) => this.setState({pass2})}/>
            <FormValidationMessage>{this.state.passwordMatchError}</FormValidationMessage>
             
           
            <CheckBox
                title='Do you accept the Terms and Conditions?'   
                checked={this.state.tAndC}
                onPress={(tAndC) => this.toggleFFUSer('tAndC')}
                containerStyle={styles.CheckBox}
                checkedColor='#21df21'
                textStyle={styles.CheckBoxTextStyle}
                checkedTitle='I accept the Terms and Coniditions'
            />
            
              
             <TouchableOpacity style={styles.buttonContainer } onPress={()=>this.submitButton()}>
                <Text  style={styles.buttonText}>Submit</Text>
            </TouchableOpacity> 

            <Text  style={styles.text}  onPress={()=>this.goToTandC()} >Terms and Conditions</Text> 
            </View>
            </ScrollView>
        </View>
         </KeyboardAvoidingView> 
         
    );
  }
}


const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c3e50',
    },
    form: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center',
    },
     buttonContainer:{
        backgroundColor: '#287BAF',
        paddingVertical: 15,
        padding: 20
    },
    buttonText:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    },
    FormInput:{
        width:275,
     
    },
    CheckBox:{
        backgroundColor: '#2c3e50',
    },
    CheckBoxTextStyle:{
       color: '#fff', 
    },
    text:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700',
        paddingVertical: 5
    },
     logo2: {
        alignItems: 'center',
        width: 20,
        height: 20,
        
    },

});