package com.PhoneShop.repository;

import com.PhoneShop.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    public UserEntity findByUsernameAndPassword(String username, String password);

    public UserEntity findBySessionId(String sessionId);

    public UserEntity findByUsername(String username);

    @Query("SELECT u FROM UserEntity u WHERE u.email LIKE %:email%")
    public List<UserEntity> findByEmail(@Param("email")String email);

    @Query("SELECT u FROM UserEntity u WHERE u.username LIKE %:username%")
    public List<UserEntity> findByUserName(@Param("username")String username);
}
