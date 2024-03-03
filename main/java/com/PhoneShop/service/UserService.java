package com.PhoneShop.service;


import com.PhoneShop.component.EmailUtils;
import com.PhoneShop.entity.ProductEntity;
import com.PhoneShop.entity.RoleEntity;
import com.PhoneShop.entity.UserEntity;
import com.PhoneShop.entity.UserRoleEntity;
import com.PhoneShop.exception.UserAlreadyExistException;
import com.PhoneShop.model.Product;
import com.PhoneShop.model.User;
import com.PhoneShop.repository.RoleRepository;
import com.PhoneShop.repository.UserRepository;
import com.PhoneShop.repository.UserRoleRepository;
import com.PhoneShop.utils.EncrytedPasswordUtils;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.BeanUtils;


import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailUtils emailUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

//    public void register(User user) throws UserAlreadyExistException {
//
//        //Let's check if user already registered with us
//        if(checkIfUserExist(user.getEmail())){
//            throw new UserAlreadyExistException("User already exists for this email");
//        }
//        UserEntity userEntity = new UserEntity();
//        BeanUtils.copyProperties(user, userEntity);
//        encodePassword(userEntity, user);
//        userRepository.save(userEntity);
//    }



//    public boolean checkIfUserExist(String email) {
//        return userRepository.findByEmail(email) !=null ? true : false;
//    }

//    private void encodePassword(UserEntity userEntity, User user){
//        userEntity.setPassword(passwordEncoder.encode(user.getPassword()));
//    }



    public boolean checkIfUserExist(String username) {
        return userRepository.findByUsername(username) !=null ? true : false;
    }

    public UserEntity getUserInforByUsername(String username) {
        UserEntity userEntity = userRepository.findByUsername(username);
        return new ModelMapper().map(userEntity, new TypeToken<UserEntity>() {}.getType());
    }

    public String createAccount(User user) {
        if(checkIfUserExist(user.getUsername())){
            return "fail";
        }
        UserEntity userEntity = new ModelMapper().map(user, UserEntity.class);
        userEntity.setPassword(EncrytedPasswordUtils.encrytePassword(user.getPassword()));

        userEntity = userRepository.save(userEntity);
        UserRoleEntity userRoleEntity = new UserRoleEntity();
        userRoleEntity.setUserEntity(userEntity);
        userRoleEntity.setRoleEntity(roleRepository.findByName("ROLE_USER"));
        userRoleRepository.save(userRoleEntity);
        emailUtils.sendMailRegister(user);
        return "success";
    }

    public String login(User user) {
        UserEntity userEntity = userRepository.findByUsernameAndPassword(user.getUsername(), user.getPassword());
        if(userEntity != null) {
            //Generate sesionId
            String sessionId = UUID.randomUUID().toString();
            userEntity.setSessionId(sessionId);
            userRepository.save(userEntity);
            return sessionId;
        }
        return "fail";
    }

    public User findBySessionId(String sessionId) {
        UserEntity userEntity = userRepository.findBySessionId(sessionId);
        return new ModelMapper().map(userEntity, User.class);
    }

    public List<User> findByEmail(String email) {
        List<UserEntity> userEntities = userRepository.findByEmail(email);
        return new ModelMapper().map(userEntities, new TypeToken<List<User>>() {}.getType());
    }

    public UserDetails findByUsername(String username) {
        return userDetailsService.loadUserByUsername(username);
    }
}
