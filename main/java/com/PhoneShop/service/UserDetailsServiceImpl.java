package com.PhoneShop.service;

import java.util.ArrayList;
import java.util.List;


import com.PhoneShop.entity.UserRoleEntity;
import com.PhoneShop.repository.UserRoleRepository;
import com.PhoneShop.utils.EncrytedPasswordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        List<UserRoleEntity> userRoleEntityList = this.userRoleRepository.findByUsername(userName);

        if (userRoleEntityList.size() == 0) {
            System.out.println("User not found! " + userName);
            throw new UsernameNotFoundException("User " + userName + " was not found in the database");
        }

        List<GrantedAuthority> grantList = new ArrayList<GrantedAuthority>();

        for (UserRoleEntity role : userRoleEntityList) {
            // ROLE_USER, ROLE_ADMIN,..
            GrantedAuthority authority = new SimpleGrantedAuthority(role.getRoleEntity().getName());
            grantList.add(authority);
        }


        UserDetails userDetails = (UserDetails) new User(userName,  // tra vef object/ lấy du
                userRoleEntityList.get(0).getUserEntity().getPassword(), grantList);

        return userDetails;
    }
}
