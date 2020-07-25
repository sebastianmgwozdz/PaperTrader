package com.papertrader.api.rest;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {
	
	@Query(value = "SELECT * FROM Positions p WHERE p.userId=:id AND NOT p.remaining=0", nativeQuery = true)
	List<Position> findAllActivePositionsByUser(@Param("id") String id);
	
	@Query(value = "SELECT * FROM Positions p WHERE p.userId=:id AND NOT p.remaining=0 AND p.ticker=:ticker", nativeQuery = true)
	List<Position> findAllActivePositionsByUserAndTicker(@Param("id") String id, @Param("ticker") String ticker);
	
	@Query(value = "SELECT * FROM Positions p WHERE p.userId=:id AND p.remaining=0", nativeQuery = true)
	List<Position> findAllClosedPositionsByUser(@Param("id") String id);
	
	@Query(value = "SELECT * FROM Positions p WHERE p.userId=:id AND p.remaining=0 AND p.ticker=:ticker", nativeQuery = true)
	List<Position> findAllClosedPositionsByUserAndTicker(@Param("id") String id, @Param("ticker") String ticker);
	
	@Modifying
	@Transactional
	@Query(value = "DELETE FROM Positions WHERE userId=:id", nativeQuery = true)
	void deleteAllPositionsById(@Param("id") String id);
}