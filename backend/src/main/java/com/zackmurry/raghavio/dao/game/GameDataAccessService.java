package com.zackmurry.raghavio.dao.game;

import com.zackmurry.raghavio.exception.InternalServerException;
import com.zackmurry.raghavio.model.GameEntity;
import com.zackmurry.raghavio.model.MapSize;
import org.flywaydb.core.internal.jdbc.JdbcTemplate;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class GameDataAccessService implements GameDao {

    private final JdbcTemplate jdbcTemplate;

    public GameDataAccessService(DataSource dataSource) throws SQLException {
        this.jdbcTemplate = new JdbcTemplate(dataSource.getConnection());
    }

    @Override
    public void createGame(@NonNull GameEntity gameEntity) {
        final String sql = "INSERT INTO games (id, map_size) VALUES (?, ?)";
        try {
            jdbcTemplate.execute(
                    sql,
                    gameEntity.getId(),
                    gameEntity.getMapSize().toString()
            );
        } catch (SQLException e) {
            e.printStackTrace();
            throw new InternalServerException();
        }
    }

    @Override
    public Optional<GameEntity> getGameById(String id) {
        final String sql = "SELECT * FROM games WHERE id = ?";
        try {
            final List<GameEntity> gameEntities = jdbcTemplate.query(
                    sql,
                    resultSet -> new GameEntity(
                            resultSet.getString("id"),
                            MapSize.valueOf(resultSet.getString("map_size"))
                    ),
                    id
            );
            if (gameEntities.isEmpty()) {
                return Optional.empty();
            }
            return Optional.of(gameEntities.get(0));
        } catch (SQLException e) {
            e.printStackTrace();
            throw new InternalServerException();
        }
    }
}
